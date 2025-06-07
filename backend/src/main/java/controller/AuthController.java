package controller;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import io.jsonwebtoken.Jwts;
import model.User;
import repository.UserRepository;
import jwt.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Value("${twilio.service_id}")
    private String serviceId;

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phoneNumber");

        Verification verification = Verification.creator(
                serviceId,
                phone,
                "sms"
        ).create();
        return ResponseEntity.ok("OTP sent to " + phone);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phoneNumber");
        String otp = payload.get("otp");

        VerificationCheck check = VerificationCheck.creator(serviceId)
                .setTo(phone)
                .setCode(otp)
                .create();

        if ("approved".equals(check.getStatus())) {
            Optional<User> userOptional = userRepository.findByPhoneNumber(phone);
            if (userOptional.isEmpty()) {
                userRepository.save(new User(null, phone));
            }

            String token = jwtUtil.generateToken(phone);
            return ResponseEntity.ok(Map.of("token", token));
        } else {
            return ResponseEntity.status(401).body("Invalid OTP");
        }
    }
    @PostMapping("/profile")
    public ResponseEntity<?> saveUserProfile(
            @RequestBody Map<String, String> profileData,
            @RequestHeader("Authorization") String token
    ) {
        String jwtToken = token.replace("Bearer ", "");
        String phoneNumber = Jwts.parser()
                .setSigningKey(jwtUtil.getJwtSecret())
                .parseClaimsJws(jwtToken)
                .getBody()
                .getSubject();

        Optional<User> userOpt = userRepository.findByPhoneNumber(phoneNumber);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();
        user.setFullName(profileData.get("fullName"));
        user.setEmail(profileData.get("email"));

        userRepository.save(user);

        return ResponseEntity.ok("Profile saved");
    }

}
