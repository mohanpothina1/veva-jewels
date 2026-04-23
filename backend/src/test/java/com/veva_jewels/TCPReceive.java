package modcontrol.net;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;
import java.util.function.Consumer;

public class TCPReceive extends Thread {

	private final Socket socket; // connection object
	private final Consumer<byte[]> frameCallback;

	public TCPReceive(Socket socket, Consumer<byte[]> frameCallback) {
		this.socket = socket;
		this.frameCallback = frameCallback;
	}

	@Override
	public void run() {
		try {

			// socket.setSoTimeout(2000);
			InputStream in = socket.getInputStream();

			while (!socket.isClosed()) {
				// try {
				byte[] frame = readFrame(in);

				if (frame != null && frameCallback != null) {
					frameCallback.accept(frame);
				}
				// } catch (SocketTimeoutException e) { }
			}
		} catch (Exception e) {
			System.out.println("Receiver stopped.");
		}
	}

	// private byte[] readFrame(InputStream in) throws IOException {
	//
	//
	// ByteArrayOutputStream buffer = new ByteArrayOutputStream();
	//
	// int b;
	//
	//// int count = 0;
	//
	// // Wait for frame start (0x5A)
	// while ((b = in.read()) != -1) {
	// if (b == 0x5A) {
	// buffer.write(b);
	// break;
	// }
	//// if (++count > 1024)
	//// return null;
	// }
	//
	// if (b == -1)
	// return null;
	//
	// // Read until frame end (0xA5)
	// while ((b = in.read()) != -1) {
	// buffer.write(b);
	// if (b == 0xA5) {
	// break;
	// }
	//// if (buffer.size() > 2048)
	//// return null;
	// }
	//
	// return buffer.toByteArray();
	// }

	private byte[] readFrame(InputStream in) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();

		int b;
		while ((b = in.read()) != -1) {
			if (b == 0x5A) {
				baos.reset();
				baos.write(b);
				while ((b = in.read()) != -1) {
					baos.write(b);
					if (b == 0xA5) {
						return baos.toByteArray();
					}
				}
			} else if (b == 0x43) {
				baos.reset();
				baos.write(b);
				while ((b = in.read()) != -1) {
					baos.write(b);
					if (b == 0x0A) {
						return baos.toByteArray();
					}
				}
			}
		}

		return null;
	}

	// private byte[] readFrame(InputStream in) throws IOException {
	//
	// ByteArrayOutputStream buffer = new ByteArrayOutputStream();
	//
	// int b = in.read();
	// if (b == -1)
	// return null;
	//
	// if (b == 0x5A) {
	// buffer.write(b);
	//
	// while ((b = in.read()) != -1) {
	// buffer.write(b);
	// if (b == 0xA5)
	// break;
	// }
	// return buffer.toByteArray();
	// } else if (b == 0x43) {
	// buffer.write(b);
	// while ((b = in.read()) != -1) {
	// buffer.write(b);
	// if (b == 0x0A)
	// break;
	// }
	// return buffer.toByteArray();
	// }
	// return null;
	//
	// }
}