package modcontrol.net;

import java.awt.Color;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.ArrayList;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;

import javax.swing.JCheckBox;
import javax.swing.SwingUtilities;
import javax.swing.Timer;

import modcontrol.model.HardwareData;
import modcontrol.ui.ColoredBoxIcon;
import modcontrol.ui.IPAddress;

public class ControlCardSocketHandler implements Runnable {

	private final String ip;
	private final int port;

	private final byte[] statusCommand; // sending cmd
	private Thread senderThread;

	private final Consumer<Boolean> statusCallback; // one action changes
	private final Consumer<HardwareData> dataCallback;

	private final ArrayBlockingQueue<byte[]> sendQueue; // thread-safe

	private volatile boolean running = true; // main loop
	private final AtomicBoolean connected = new AtomicBoolean(false); // thread-safe

	private Socket socket; // connection object
	private OutputStream out; // sending the data

	private ScheduledExecutorService scheduler;
	private TCPReceive receiver; // receiver object

	private ArrayList<JCheckBox> lans; // stores the checkboxes

	private volatile HardwareData lastData;
	// private volatile long lastDataTime = 0;

	private boolean pingStarted = false;
	// private static final double VSWR_LIMIT = 3.0;
	// private boolean vswrTrip = false;
	// private List<Module> modules;

	public ControlCardSocketHandler(String ip, int port, byte[] statusCommand, Consumer<Boolean> statusCallback,
			Consumer<HardwareData> dataCallback) {

		this.ip = ip;
		this.port = port;
		this.statusCommand = statusCommand;
		this.statusCallback = statusCallback;
		this.dataCallback = dataCallback;
		this.sendQueue = new ArrayBlockingQueue<>(100);
	}

	public HardwareData getLastData() {
		return lastData;
	}

	public void enqueueCommand(byte[] command) {
		// sendQueue.offer(command);
		if (command != null && connected.get()) {
			sendQueue.offer(command);
		}
	}

	public boolean isConnected() {
		return connected.get();
	}

	public void shutdown() {
		running = false;
		closeSocket();
	}

	public void start() {
		new Thread(this).start();
	} // creates new thread and executes run method inside

	@Override
	public void run() {

		boolean lastStatus = false;

		if (!pingStarted) {
			startPingChecker();
			pingStarted = true;
		}

		while (running) {

			try {

				socket = new Socket();

				socket.connect(new InetSocketAddress(ip, port), 2000);
				System.out.println("TCP Connection Started!");

				out = socket.getOutputStream();

				connected.set(true);
				System.out.println("Connected to " + ip + ":" + port);

				if (!lastStatus && statusCallback != null) {
					statusCallback.accept(true);
					// updateLanStatus(true);
					lastStatus = true;
				}

				// if (statusCallback != null) {
				// statusCallback.accept(true);
				// }
				//
				// updateLanStatus(true);

				startReceiver();
				startSender();

				if (statusCommand != null && statusCommand.length > 0) {
					startAutoPolling();
				}
				while (running && socket != null && !socket.isClosed()) {
					// if (!IPAddress.tester(ip)) {
					// System.out.println("Ping lost");
					// break;
					// }
					// long now = System.currentTimeMillis();
					// if(now - lastDataTime > 3000) {
					// System.out.print("No data from " + ip);
					//// connected.set(false);
					//// updateLanStatus(false);
					// closeSocket();
					// break;
					// }
					Thread.sleep(200);
				}

			} catch (Exception e) {
				 System.out.println("Connection failed for: " + ip + ":" + port);
				connected.set(false);

				// System.out.println("Calling statusCallback false;...");

				// if (lastStatus && statusCallback != null) {
				// statusCallback.accept(false);
				// lastStatus=false;
				//// updateLanStatus(false);
				// } else {
				// System.out.println("statusback is null");
				// }

				// if (statusCallback != null) {
				// statusCallback.accept(false);
				// }
				// updateLanStatus(false);
				closeSocket();

				try {
					Thread.sleep(2000);
				} catch (InterruptedException ignored) {
				}
			}
		}
	}

	private void startReceiver() {
		receiver = new TCPReceive(socket, this::handleFrame);
		receiver.start();
	}// start receiver thread

	private void startAutoPolling() {

		// if (healthStatus) {
		// System.out.println("health status " + ip);
		// return;
		// }
		if (statusCommand == null)
			return;
		scheduler = Executors.newSingleThreadScheduledExecutor();

		scheduler.scheduleAtFixedRate(() -> {
			if (connected.get() && statusCommand != null) {
				enqueueCommand(statusCommand);
			}
		}, 0, 1, TimeUnit.SECONDS);
	}

	private void handleFrame(byte[] frame) {

		try {
			if (isAsciiFrame(frame)) {
				String str = new String(frame).trim();
				if (str.contains("CO.HL.G")) {
					HardwareData data = parseStatus(str);
					this.lastData = data;
					if (dataCallback != null) {
						dataCallback.accept(data);
					}
					// return;
					System.out.println(
							" VSWR : " + data.vswr + " TEMP: " + data.temp + " FWD: " + data.fwd + " RFL: " + data.rfl);
				}
			}
			// if (!verifyXor(frame)) return;
			if (!verifyXor(frame)) {
				System.out.println("XOR failed" + bytesToHex(frame));
				return;
			}

			HardwareData data = parseFrame(frame);
			this.lastData = data;
			// this.lastDataTime = System.currentTimeMillis();

			if (dataCallback != null) {
				dataCallback.accept(data);
			}

			System.out
					.println("VSWR: " + data.vswr + " TEMP: " + data.temp + " FWD: " + data.fwd + " RFL: " + data.rfl);
			// // System.out.println("Sent command: " + bytesToHex(cmd));
		} catch (Exception e) {
			System.out.println("Status parse error");
		}

	}

	private HardwareData parseStatus(String response) {
		HardwareData data = new HardwareData();

		try {
			String[] parts = response.split(",");
			if (parts.length >= 6) {
				// data.paOn = parts[1].equals("1");
				data.paOn = "1".equals(parts[1].trim());
				data.vswr = safeDouble(parts[2]);
				data.temp = safeInt(parts[3]);
				data.fwd = (int) safeDouble(parts[3]);
				data.rfl = (int) safeDouble(parts[4]);
				// data.fwd = Integer.parseInt(parts[4]);
				// data.rfl = Integer.parseInt(parts[5]);
			}
		} catch (Exception e) {
			System.out.println("Parse error: " + data);
		}

		return data;
	}

	private int safeInt(String s) {
		try {
			if (s == null)
				return 0;
			return Integer.parseInt(s.trim());
		} catch (Exception e) {
			return 0;
		}
	}

	private double safeDouble(String s) {
		try {
			if (s == null)
				return 0.0;
			return Double.parseDouble(s.trim());
		} catch (Exception e) {
			return 0;
		}
	}

	private HardwareData parseFrame(byte[] frame) {

		HardwareData data = new HardwareData();
		data.paOn = false;
		int i = 0;

		while (i < frame.length) {

			int id = frame[i] & 0xFF;

			if (id == 0xF1) { // FWD Power
				data.fwd = frame[i + 2] & 0xFF;
				if (data.fwd > 0)
					data.paOn = true;
				i += 3;
			} else if (id == 0xF2) { // RFL Power
				data.rfl = frame[i + 2] & 0xFF;
				i += 3;
			} else if (id == 0x20) { // Temperature
				data.temp = ((frame[i + 2] & 0xFF) << 8) | (frame[i + 3] & 0xFF);
				i += 4;
			} else if (id == 0x21) { // VSWR
				int raw = ((frame[i + 2] & 0xFF) << 8) | (frame[i + 3] & 0xFF);
				data.vswr = raw / 10.0;
				// if (data.vswr > 1.0)
				// data.paOn = true;
				i += 4;
			} else {
				i++;
			}
		}

		return data;
	}

	private boolean verifyXor(byte[] frame) {
		// calculates xor
		if (frame.length < 3)
			return false;

		int xor = 0;

		for (int i = 0; i < frame.length - 2; i++) {
			xor ^= frame[i];
		}

		return xor == (frame[frame.length - 2] & 0xFF);
	}

	private void closeSocket() {
		// shutdown the socket
		connected.set(false);

		try {
			if (scheduler != null && !scheduler.isShutdown())
				scheduler.shutdownNow();
		} catch (Exception ignored) {
		}

		try {
			if (socket != null)
				socket.close();
		} catch (Exception ignored) {
		}
	}

	public void setLans(ArrayList<JCheckBox> lans) {
		this.lans = lans; // stores lan
	}

	private void startSender() {

		senderThread = new Thread(() -> {
			try {
				while (running && socket != null && !socket.isClosed()) {

					byte[] cmd = sendQueue.take(); // waits for command

					if (out != null) {
						out.write(cmd);
						out.flush();

						// Debug
						System.out.println("Sent: " + bytesToHex(cmd));
					}
				}
			} catch (Exception e) {
				System.out.println("Sender stopped.");
			}
		});

		senderThread.start();
	}

	private String bytesToHex(byte[] bytes) {
		StringBuilder sb = new StringBuilder();
		for (byte b : bytes)
			sb.append(String.format("%02X ", b));
		return sb.toString();
	}

	private void startPingChecker() {
		Timer t = new Timer(1000, e -> {
			new Thread(() -> {
				boolean reachable = IPAddress.tester(ip);
				// System.out.println("PING " + ip + "=" + reachable);

				SwingUtilities.invokeLater(() -> {
					if (lans != null) {
						for (JCheckBox box : lans) {
							box.setIcon(new ColoredBoxIcon(reachable ? Color.GREEN : Color.RED));
						}
					}

					if (!reachable && connected.get()) {
						System.out.println("Ping lost");
						connected.set(false);

						if (statusCallback != null) {
							statusCallback.accept(false);
						}
						closeSocket();
					}
				});

			}).start();
		});

		t.start();
	}

	private boolean isAsciiFrame(byte[] frame) {
		for (byte b : frame) {
			if (b < 0x09 || b > 0x7E) {
				return false;
			}
		}
		return true;

		// return frame.length > 0 && frame[0] == 'C';
	}

	// private boolean checkPing() {
	// return IPAddress.tester(ip);
	// }

	public void updateLanStatus(boolean connected) { // this updates lan
		if (lans == null) {
			SwingUtilities.invokeLater(() -> {
				for (JCheckBox lanBox : lans) {
					lanBox.setIcon(new ColoredBoxIcon(connected ? Color.GREEN : Color.RED));
					lanBox.setOpaque(true);
					lanBox.setSelected(connected);
					lanBox.revalidate();
					lanBox.repaint();
				}
			});
		}
	}

}

// private void handleFrame(byte[] frame) {
//
// if (!verifyXor(frame)) {
// System.out.println("XOR failed");
// return;
// }
//
// HardwareData data = parseFrame(frame);
//
// // VSWR PROTECTION
//// if (data.vswr > VSWR_LIMIT && !vswrTrip) {
////
//// vswrTrip = true;
////
//// System.out.println("HIGH VSWR detected: " + data.vswr);
////
//// shutdownBand();
//// }
////
//// if (data.vswr <= VSWR_LIMIT) {
//// vswrTrip = false;
//// }
//
// if (dataCallback != null) {
// dataCallback.accept(data);
// }
//
// System.out.println("VSWR: " + data.vswr +
// " TEMP: " + data.temp +
// " FWD: " + data.fwd +
// " RFL: " + data.rfl);
// }

// private void shutdownBand() {
//
// if (modules == null || modules.isEmpty()) return;
//
// for (Module m : modules) {
//
// try {
//
// byte[] cmd = hexStringToBytes(m.power_off);
//
// enqueueCommand(cmd);
//
// System.out.println("Band shutdown: " + m.name);
//
// } catch (Exception e) {
// e.printStackTrace();
// }
// }
// }

// private byte[] hexStringToBytes(String hex) {
//
// hex = hex.replace(",", "").replace(" ", "");
//
// byte[] data = new byte[hex.length() / 2];
//
// for (int i = 0; i < hex.length(); i += 2) {
//
// data[i / 2] =
// (byte) ((Character.digit(hex.charAt(i), 16) << 4)
// + Character.digit(hex.charAt(i + 1), 16));
// }
//
// return data;
// }

// private void handleFrame(byte[] frame) {
//
// if (!verifyXor(frame)) {
// System.out.println("XOR failed");
// return;
// }
//
// HardwareData data = parseFrame(frame);
//
// // VSWR PROTECTION
// if (data.vswr > VSWR_LIMIT && !vswrTrip) {
//
// vswrTrip = true;
//
// System.out.println("HIGH VSWR DETECTED: " + data.vswr);
// System.out.println("Shutting down band...");
//
// shutdownBand();
// }
//
// if (data.vswr <= VSWR_LIMIT) {
// vswrTrip = false;
// }
//
//
// if (dataCallback != null) {
// dataCallback.accept(data);
// }
//
// System.out.println("VSWR: " + data.vswr +
// " TEMP: " + data.temp +
// " FWD: " + data.fwd +
// " RFL: " + data.rfl);
// }