package modcontrol.ui;

private static String extract(String block, String key) {

    int i = block.indexOf("\"" + key + "\":");

    if (i == -1)
        return "";

    int start = block.indexOf(":", i) + 1;

    if (start <= 0 || start >= block.length())
        return "";

    char first = block.charAt(start);

    // STRING VALUE
    if (first == '"') {

        int end = block.indexOf("\"", start + 1);

        if (end == -1)
            return "";

        return block.substring(start + 1, end);
    }

    // BOOLEAN / NUMBER VALUE
    int end = start;

    while (end < block.length()
            && block.charAt(end) != ','
            && block.charAt(end) != '}') {

        end++;
    }

    return block.substring(start, end).trim();
}

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Cursor;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.awt.GridLayout;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.io.File;
import java.nio.file.Files;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.swing.BorderFactory;
import javax.swing.ImageIcon;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFileChooser;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.JTextPane;
import javax.swing.JToggleButton;
import javax.swing.SwingConstants;
import javax.swing.SwingUtilities;
import javax.swing.Timer;
import javax.swing.border.LineBorder;

import modcontrol.config.Config;
import modcontrol.model.ControlCard;
import modcontrol.model.HardwareData;
import modcontrol.model.Module;
import modcontrol.model.PowerSupply;
import modcontrol.net.ControlCardSocketHandler;
import modcontrol.net.PowerSupplySocketHandler;
import javax.swing.border.TitledBorder;
import javax.swing.text.BadLocationException;
import javax.swing.text.Document;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;

import javax.swing.JScrollPane;
import javax.swing.JTabbedPane;

public class ControlSystemUI extends JFrame {

	private static final long serialVersionUID = 1L;
	private final Map<String, ControlCardSocketHandler> cardHandlers = new HashMap<>();
	private final Map<String, PowerSupplySocketHandler> psuHandlers = new HashMap<>();
	private final Map<String, List<JToggleButton>> toggleMap = new HashMap<>();
	private final Map<String, JLabel> statusLabels = new HashMap<>();
	private final Map<String, JLabel> freqBandsLabels = new HashMap<>();
	private JLabel JLabel;
	private JLabel lblEcmMkIii;
	private JLabel label_Time;
	private JPanel panel;
	private JPanel panel_1;
	private JPanel panel_2;

	ArrayList<JTextField> vswrList = new ArrayList<>();
	ArrayList<JTextField> tempList = new ArrayList<>();
	ArrayList<JTextField> fwdList = new ArrayList<>();
	ArrayList<JTextField> rflList = new ArrayList<>();

	private JTextPane logPane;

	public ControlSystemUI(Config config) throws InterruptedException {
		setTitle("ECM MK III Jammer System (20-6000 MHz)");
		setIconImage(Toolkit.getDefaultToolkit().getImage("images/JammerVehicle.jpg"));
		setSize(1000, 700);
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		BorderLayout borderLayout = new BorderLayout();
		borderLayout.setVgap(25);
		getContentPane().setLayout(borderLayout);
		JPanel northPanel = new JPanel();
		northPanel.setBorder(new LineBorder(new Color(0, 0, 0), 2));
		northPanel.setLayout(new BorderLayout(0, 0));

		getContentPane().add(northPanel, BorderLayout.NORTH);

		panel = new JPanel();
		FlowLayout flowLayout_1 = (FlowLayout) panel.getLayout();
		flowLayout_1.setVgap(20);
		northPanel.add(panel, BorderLayout.WEST);
		JButton powerOnAll = new JButton("Power All ON");
		powerOnAll.setFont(new Font("Arial", Font.BOLD, 14));
		powerOnAll.setPreferredSize(new Dimension(150, 50));
		powerOnAll.setFocusPainted(false);
		powerOnAll.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		powerOnAll.setCursor(new Cursor(Cursor.HAND_CURSOR));

		Color defaultOnColor = powerOnAll.getBackground();

		panel.add(powerOnAll);
		JButton powerOffAll = new JButton("Power All OFF");
		powerOffAll.setFont(new Font("Arial", Font.BOLD, 14));
		powerOffAll.setPreferredSize(new Dimension(150, 50));
		powerOffAll.setFocusPainted(false);
		powerOffAll.setBorder(BorderFactory.createLineBorder(Color.BLACK));
		powerOffAll.setCursor(new Cursor(Cursor.HAND_CURSOR));

		Color defaultOffColor = powerOffAll.getBackground();

		panel.add(powerOffAll);

		powerOnAll.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				powerOnAll.setForeground(new Color(0, 128, 0));
				powerOffAll.setBackground(defaultOffColor);
				powerOffAll.setForeground(Color.BLACK);

			}
		});

		powerOffAll.addActionListener(new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				// powerOffAll.setBackground(Color.RED);
				powerOffAll.setForeground(Color.RED);
				powerOnAll.setBackground(defaultOnColor);
				powerOnAll.setForeground(Color.BLACK);
			}
		});

		panel_1 = new JPanel();
		FlowLayout flowLayout = (FlowLayout) panel_1.getLayout();
		flowLayout.setVgap(30);

		label_Time = new JLabel();
		panel_1.add(label_Time);
		label_Time.setFont(new Font("Arial", Font.BOLD, 20));
		label_Time.setForeground(new Color(0, 128, 0));
		Timer timer = new Timer(1000, new ActionListener() {

			@Override
			public void actionPerformed(ActionEvent e) {
				updateTime();
			}
		});
		timer.start();
		updateTime();
		northPanel.add(panel_1, BorderLayout.EAST);

		panel_2 = new JPanel();
		northPanel.add(panel_2, BorderLayout.CENTER);

		JLabel = new JLabel();
		panel_2.add(JLabel);
		JLabel.setIcon(new ImageIcon("images/Bel_logo.png"));
		JLabel.setFont(new Font("Arial", Font.BOLD, 22));
		JLabel.setHorizontalAlignment(SwingConstants.LEFT);

		lblEcmMkIii = new JLabel("ECM MK III Jammer System (20-6000 MHz)");
		panel_2.add(lblEcmMkIii);
		lblEcmMkIii.setIcon(new ImageIcon("images/JammerVehicle1.jpg"));
		lblEcmMkIii.setFont(new Font("Arial", Font.BOLD, 22));
		lblEcmMkIii.setHorizontalAlignment(SwingConstants.RIGHT);

		// Global OFF
		powerOffAll.addActionListener(e -> {
			powerOffAllPAs(config);
		});

		// Global ON
		powerOnAll.addActionListener(e -> {
			for (PowerSupply psu : config.power_supplies) {
				PowerSupplySocketHandler psuHandler = psuHandlers.get(psu.id);
				if (psuHandler != null && psuHandler.isConnected()) {

					if (psu.id.equals("psu_02")) {
						psuHandler.enqueueCommand("CO.PS.S,0,1".getBytes());

					} else {
						for (ControlCard card : psu.control_cards) {
							if (card.on_command != null && !card.on_command.isEmpty()) {
								splitCmd(card.on_command, psuHandler);

								psuHandler.enqueueCommand(hexStringToBytes(card.on_command));

								for (int i = 0; i < card.modules.size(); i++) {
									ControlCardSocketHandler handle = cardHandlers.get(card.id);
									if (handle != null && handle.isConnected()) {
									}
								}
							}
						}
					}
				}
			}

			for (ControlCard card : config.standalone_control_cards) {
				ControlCardSocketHandler handler = cardHandlers.get(card.id);
				if (handler != null && handler.isConnected()) {
					// for (Module m : card.modules)
					for (int i = 0; i < card.modules.size(); i++) {
					}
				}
			}
		});

		// CENTER PANEL (scrollable vertical layout)
		JPanel centerPanel = new JPanel();
		centerPanel.setBorder(new TitledBorder(new LineBorder(new Color(0, 0, 0)), "Amplifier Switch",
				TitledBorder.CENTER, TitledBorder.TOP, new Font("Segoe UI", Font.BOLD, 20), new Color(0, 0, 0)));
		centerPanel.setPreferredSize(new Dimension(700, 200));
		// centerPanel.setLayout(new BoxLayout(centerPanel, BoxLayout.Y_AXIS));
		// JScrollPane scrollPane = new JScrollPane(centerPanel);
		getContentPane().add(centerPanel, BorderLayout.CENTER);
		centerPanel.setLayout(new BorderLayout(0, 0));

		JTabbedPane tabbedPane = new JTabbedPane();
		tabbedPane.setTabPlacement(JTabbedPane.TOP);
		centerPanel.add(tabbedPane);

		JPanel PA_Panel = new JPanel();
		tabbedPane.addTab("Power Amplifier", PA_Panel);
		tabbedPane.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
		PA_Panel.setLayout(new GridLayout(0, 4, 20, 10));

		JPanel log_Panel = new JPanel();
		tabbedPane.addTab("Log", log_Panel);
		log_Panel.setLayout(new BorderLayout(0, 0));

		logPane = new JTextPane();
		logPane.setEditable(false);
		log_Panel.add(logPane, BorderLayout.CENTER);

		JScrollPane scrollPane = new JScrollPane(logPane);
		log_Panel.add(scrollPane, BorderLayout.CENTER);

		JPanel option_panel = new JPanel();
		option_panel.setPreferredSize(new Dimension(10, 50));
		log_Panel.add(option_panel, BorderLayout.SOUTH);
		option_panel.setLayout(new FlowLayout(FlowLayout.RIGHT, 5, 15));

		JButton btnSave = new JButton("Save");
		btnSave.addActionListener(e -> {
			try {
				String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));

				String fileName = "PA_Log_" + time + " .txt";
				JFileChooser chooser = new JFileChooser();
				chooser.setSelectedFile(new File(fileName));

				if (chooser.showSaveDialog(null) == JFileChooser.APPROVE_OPTION) {
					File file = chooser.getSelectedFile();

					if (!file.getName().endsWith(".txt")) {
						file = new File(file.getAbsolutePath() + ".txt");
					}
					String content = logPane.getText();

					Files.write(file.toPath(), content.getBytes());

					JOptionPane.showMessageDialog(null, "File saved: " + file.getName());
				}
			} catch (Exception ex) {
				ex.printStackTrace();
			}

		});
		option_panel.add(btnSave);

		JButton btnClear = new JButton("Clear");
		btnClear.addActionListener(e -> {
			logPane.setText("");
		});
		option_panel.add(btnClear);

		// SOUTH PANEL
		JPanel southPanel = new JPanel(new GridLayout(1, 0, 15, 10));
		southPanel.setBorder(new TitledBorder(new LineBorder(new Color(0, 0, 0)), "Control Card", TitledBorder.CENTER,
				TitledBorder.TOP, new Font("Segoe UI", Font.BOLD, 20), new Color(0, 0, 0)));
		getContentPane().add(southPanel, BorderLayout.SOUTH);

		// EAST PANEL
		JPanel eastPanel = new JPanel();
		eastPanel.setBorder(new TitledBorder(new LineBorder(new Color(0, 0, 0)), "Status Query", TitledBorder.CENTER,
				TitledBorder.TOP, new Font("Segoe UI", Font.BOLD, 20), new Color(0, 0, 0)));
		eastPanel.setPreferredSize(new Dimension(600, 0));

		getContentPane().add(eastPanel, BorderLayout.EAST);
		eastPanel.setLayout(new GridLayout(0, 3, 0, 0));
		JPanel freqband_panel = new JPanel();
		eastPanel.add(freqband_panel);
		freqband_panel.setLayout(new BorderLayout(0, 0));

		JPanel freqband_laJPanel = new JPanel();
		freqband_laJPanel.setBorder(new LineBorder(new Color(0, 0, 0)));
		freqband_panel.add(freqband_laJPanel, BorderLayout.NORTH);

		JLabel freqLabel = new JLabel("FREQ BAND");
		freqLabel.setHorizontalAlignment(SwingConstants.CENTER);
		freqLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
		freqLabel.setForeground(new Color(0, 128, 0));
		freqband_laJPanel.add(freqLabel, BorderLayout.CENTER);

		JPanel freqband_names_panel = new JPanel();
		freqband_names_panel.setBorder(new LineBorder(new Color(0, 0, 0)));
		freqband_panel.add(freqband_names_panel, BorderLayout.CENTER);

		JPanel system_status_panel = new JPanel();
		eastPanel.add(system_status_panel);
		system_status_panel.setLayout(new GridLayout(0, 3, 0, 0));

		JPanel lan_panel = new JPanel();
		system_status_panel.add(lan_panel);
		lan_panel.setLayout(new BorderLayout(0, 0));

		JPanel lan_laJPanel = new JPanel();
		lan_laJPanel.setBorder(new LineBorder(new Color(0, 0, 0)));
		lan_panel.add(lan_laJPanel, BorderLayout.NORTH);

		JLabel lanLabel = new JLabel("LAN");
		lanLabel.setHorizontalAlignment(SwingConstants.CENTER);
		lanLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
		lanLabel.setForeground(new Color(0, 128, 0));
		lan_laJPanel.add(lanLabel);

		JPanel lan_checkbox_panel = new JPanel();
		lan_checkbox_panel.setBorder(new LineBorder(new Color(0, 0, 0)));

		lan_panel.add(lan_checkbox_panel, BorderLayout.CENTER);

		JPanel vswr_panel = new JPanel();
		vswr_panel.setPreferredSize(new Dimension(30, 10));
		system_status_panel.add(vswr_panel);
		vswr_panel.setLayout(new BorderLayout(0, 0));

		JPanel vswr_laJPanel = new JPanel();
		vswr_laJPanel.setBorder(new LineBorder(new Color(0, 0, 0)));
		vswr_panel.add(vswr_laJPanel, BorderLayout.NORTH);

		JLabel vswrLabel = new JLabel("VSWR");
		vswrLabel.setHorizontalAlignment(SwingConstants.CENTER);
		vswrLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
		vswrLabel.setForeground(new Color(0, 128, 0));
		vswr_laJPanel.add(vswrLabel);

		JPanel vswr_checkbox_panel = new JPanel();
		vswr_checkbox_panel.setBorder(new LineBorder(new Color(0, 0, 0)));
		vswr_panel.add(vswr_checkbox_panel, BorderLayout.CENTER);

		JPanel temp_panel = new JPanel();
		system_status_panel.add(temp_panel);
		temp_panel.setLayout(new BorderLayout(0, 0));

		JPanel temp_laJPanel = new JPanel();
		temp_laJPanel.setBorder(new LineBorder(Color.BLACK));
		temp_panel.add(temp_laJPanel, BorderLayout.NORTH);

		JLabel therLabel = new JLabel("TEMP");
		therLabel.setHorizontalAlignment(SwingConstants.CENTER);
		therLabel.setFont(new Font("Segoe UI", Font.BOLD, 16));
		therLabel.setForeground(new Color(0, 128, 0));
		temp_laJPanel.add(therLabel);

		JPanel temp_checkbox_panel = new JPanel();
		temp_checkbox_panel.setBorder(new LineBorder(Color.BLACK));
		temp_panel.add(temp_checkbox_panel, BorderLayout.CENTER);

		JPanel powermeter_panel = new JPanel();
		eastPanel.add(powermeter_panel);
		powermeter_panel.setLayout(new GridLayout(0, 2, 0, 0));

		JPanel fwd_panel = new JPanel();
		powermeter_panel.add(fwd_panel);
		fwd_panel.setLayout(new BorderLayout(0, 0));

		JPanel fwd_laJPanel = new JPanel();
		fwd_laJPanel.setBorder(new LineBorder(Color.BLACK));
		fwd_panel.add(fwd_laJPanel, BorderLayout.NORTH);

		JLabel fwd_label = new JLabel("FWD");
		fwd_label.setHorizontalAlignment(SwingConstants.CENTER);
		fwd_label.setFont(new Font("Segoe UI", Font.BOLD, 16));
		fwd_label.setForeground(new Color(0, 128, 0));

		fwd_laJPanel.add(fwd_label);

		JPanel fwd_textfields_panel = new JPanel();

		fwd_textfields_panel.setBorder(new LineBorder(new Color(0, 0, 0)));
		fwd_panel.add(fwd_textfields_panel, BorderLayout.CENTER);

		JPanel rfl_panel = new JPanel();
		powermeter_panel.add(rfl_panel);
		rfl_panel.setLayout(new BorderLayout(0, 0));

		JPanel rfl_laJPanel = new JPanel();
		rfl_laJPanel.setBorder(new LineBorder(new Color(0, 0, 0)));
		rfl_panel.add(rfl_laJPanel, BorderLayout.NORTH);

		JLabel rfl_label = new JLabel("RFL");
		rfl_label.setHorizontalAlignment(SwingConstants.CENTER);
		rfl_label.setFont(new Font("Segoe UI", Font.BOLD, 16));
		rfl_label.setForeground(new Color(0, 128, 0));

		rfl_laJPanel.add(rfl_label);

		JPanel rfl_textfields_panel = new JPanel();
		rfl_textfields_panel.setBorder(new LineBorder(new Color(0, 0, 0)));
		rfl_panel.add(rfl_textfields_panel, BorderLayout.CENTER);

		List<ControlCard> allCards = new ArrayList<>();
		for (PowerSupply psu : config.power_supplies) {
			allCards.addAll(psu.control_cards);
		}
		allCards.addAll(config.standalone_control_cards);

		// PSU handlers
		for (PowerSupply psu : config.power_supplies) {
			String htmlText = "<html><center>PSU<br>" + psu.id + "</center></html>";

			JLabel label = new JLabel(htmlText);
			label.setOpaque(true);
			label.setFont(new Font("Segoe UI", Font.BOLD, 16));
			label.setBackground(Color.RED);
			label.setPreferredSize(new Dimension(100, 70));
			label.setForeground(Color.WHITE);
			label.setHorizontalAlignment(SwingConstants.CENTER);
			label.setVerticalAlignment(SwingConstants.CENTER);
			statusLabels.put(psu.id, label);
			southPanel.add(label);

			PowerSupplySocketHandler psuHandler = new PowerSupplySocketHandler(psu.ip, psu.port, isConnected -> {
				SwingUtilities.invokeLater(() -> {
					JLabel lbl = statusLabels.get(psu.id);
					if (lbl != null)
						lbl.setBackground(isConnected ? Color.GREEN : Color.RED);
				});
			});
			psuHandler.start();
			psuHandlers.put(psu.id, psuHandler);
		}

		int count = 0;

		// Control card handlers and UI
		for (ControlCard card : allCards) {
			final String cardId = card.id;
			int startIndex = vswrList.size();
			String htmlText = "<html><center>CTRL<br>" + cardId + "</center></html>";
			JLabel label = new JLabel(htmlText);
			label.setOpaque(true);
			label.setFont(new Font("Segoe UI", Font.BOLD, 16));
			label.setBackground(Color.RED);
			label.setForeground(Color.WHITE);
			label.setPreferredSize(new Dimension(100, 70));

			label.setHorizontalAlignment(SwingConstants.CENTER);
			label.setVerticalAlignment(SwingConstants.CENTER);
			statusLabels.put(cardId, label);
			southPanel.add(label);

			List<JToggleButton> toggles = new ArrayList<>();

			for (Module m : card.modules) {
				JToggleButton toggle = new JToggleButton(m.name);
				toggle.setFont(new Font("Arial", Font.BOLD, 28));
				toggle.setForeground(Color.RED);
				toggle.setCursor(new Cursor(Cursor.HAND_CURSOR));
				if (!m.name.equalsIgnoreCase("")) {
					toggle.setEnabled(false);
				}
				toggle.setForeground(Color.RED);

				toggle.addItemListener(e -> {
					if (!toggle.isEnabled())
						return;

					ControlCardSocketHandler handler = cardHandlers.get(card.id);

					if (handler != null && handler.isConnected()) {

						boolean isOn = toggle.isSelected();
						String command = isOn ? m.power_on : m.power_off;
						byte[] cmd = hexStringToBytes(command);
						toggle.setForeground(isOn ? Color.GREEN : Color.RED);
						
						String time = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
						String logMsg = time + " Band: " + m.name + " is " +  (isOn ? "POWERED ON" : "POWERED OFF");
						
						addLog(logMsg);

						if (m.name.equalsIgnoreCase("2400-2500MHz") || m.name.equalsIgnoreCase("136-174MHz")
								|| m.name.equalsIgnoreCase("5700-5900MHz")) {
							splitCmd(command, handler);
						} else {
							handler.enqueueCommand(cmd);
						}

						// if (!isOn) {
						//
						// int moduleIndex = card.modules.indexOf(m);
						//
						// vswrList.get(startIndex + moduleIndex).setText("--");
						// tempList.get(startIndex + moduleIndex).setText("--");
						// fwdList.get(startIndex + moduleIndex).setText("--");
						// rflList.get(startIndex + moduleIndex).setText("--");
						//
						// }
					}
				});

				PA_Panel.add(toggle);
				toggles.add(toggle);
			}

			toggleMap.put(card.id, toggles);
			for (Module freq : card.modules) {
				JLabel bandsLabel = new JLabel(freq.name);
				bandsLabel.setFont(new Font("Segoe UI", Font.BOLD, 15));
				bandsLabel.setHorizontalAlignment(SwingConstants.CENTER);
				freqBandsLabels.put(card.id, bandsLabel);
				freqband_names_panel.add(bandsLabel);
			}

			ArrayList<JCheckBox> temp = new ArrayList<>();

			for (int i = 0; i < card.modules.size(); i++) {
				JCheckBox lanBox = new JCheckBox("");
				temp.add(lanBox);
				lanBox.setHorizontalAlignment(SwingConstants.CENTER);
				lanBox.setEnabled(false);
				lan_checkbox_panel.add(lanBox);
				count++;
			}
			lan_checkbox_panel.revalidate();
			lan_checkbox_panel.repaint();

			for (int i = 0; i < card.modules.size(); i++) {
				JTextField vswrBox = new JTextField();
				vswrBox.setText("--");
				vswrBox.setHorizontalAlignment(SwingConstants.CENTER);
				vswrBox.setEditable(false);
				vswrBox.setBackground(Color.WHITE);
				vswr_checkbox_panel.add(vswrBox);
				vswrList.add(vswrBox);
			}

			for (int i = 0; i < card.modules.size(); i++) {
				JTextField therBox = new JTextField();
				therBox.setText("--");
				therBox.setHorizontalAlignment(SwingConstants.CENTER);
				therBox.setEditable(false);
				therBox.setBackground(Color.WHITE);
				temp_checkbox_panel.add(therBox);
				tempList.add(therBox);
			}

			for (int i = 0; i < card.modules.size(); i++) {
				JTextField fwdField = new JTextField();
				fwdField.setText("--");
				fwdField.setHorizontalAlignment(SwingConstants.CENTER);
				fwdField.setEditable(false);
				fwdField.setBackground(Color.WHITE);
				fwd_textfields_panel.add(fwdField);
				fwdList.add(fwdField);
			}

			for (int i = 0; i < card.modules.size(); i++) {
				JTextField rflField = new JTextField();
				rflField.setText("--");
				rflField.setHorizontalAlignment(SwingConstants.CENTER);
				rflField.setEditable(false);
				rflField.setBackground(Color.WHITE);
				rfl_textfields_panel.add(rflField);
				rflList.add(rflField);
			}

			
			ControlCardSocketHandler handler = new ControlCardSocketHandler(card.ip, card.port,
					hexStringToBytes(card.status_command), isConnected -> {
						updateCardStatus(cardId, isConnected);
						List<JToggleButton> btns = toggleMap.get(card.id);
						if (btns != null) {
							for (JToggleButton btn : btns) {
								btn.setEnabled(isConnected);
								if (isConnected) {
									for (Module m : card.modules) {
										if (m.name.equalsIgnoreCase(btn.getText())) {
											if (m.name.equalsIgnoreCase("2400-2500MHz")
													|| m.name.equalsIgnoreCase("136-174MHz")
													|| m.name.equalsIgnoreCase("5700-5900MHz")) {
												cardHandlers.get(card.id).enqueueCommand(hexStringToBytes(m.power_off));
											} else {
												cardHandlers.get(card.id).enqueueCommand(hexStringToBytes(m.power_off));
											}
											break;
										}
									}
								}
							}
						}
					}, data -> {
						SwingUtilities.invokeLater(() -> {
							for (int i = 0; i < card.modules.size(); i++) {

								JTextField vswrField = vswrList.get(startIndex + i);
								JTextField tempField = tempList.get(startIndex + i);

								// if (!data.paOn) {
								//
								// // vswrField.setText("--");
								// vswrField.setBackground(Color.WHITE);
								// vswrField.setForeground(Color.BLACK);
								// vswrField.setToolTipText(null);
								//
								// // tempList.get(startIndex + i).setText("--");
								// fwdList.get(startIndex + i).setText("--");
								// rflList.get(startIndex + i).setText("--");
								//
								// continue;
								// }

								double vswr = data.vswr;
								vswrField.setText(String.valueOf(vswr));

								if (vswr >= 3.5) {
									vswrField.setBackground(Color.RED);
									vswrField.setForeground(Color.WHITE);
									vswrField.setToolTipText("Alert VSWR High..!");
								} else if (vswr >= 2.5) {
									vswrField.setBackground(Color.YELLOW);
									vswrField.setForeground(Color.BLACK);
									vswrField.setToolTipText("Warning VSWR");
								} else {
									vswrField.setBackground(Color.GREEN);
									vswrField.setForeground(Color.BLACK);
									vswrField.setToolTipText(null);
								}

								// vswrList.get(startIndex + i).setText(String.valueOf(data.vswr));

								int temperature = data.temp;
								tempField.setText(String.valueOf(temperature));

								if (temperature >= 60) {
									tempField.setBackground(Color.RED);
									tempField.setForeground(Color.WHITE);
									tempField.setToolTipText("Alert High Temperature..!");
								} else if (temperature >= 45) {
									tempField.setBackground(Color.YELLOW);
									tempField.setForeground(Color.BLACK);
									tempField.setToolTipText("Warning Temperature is above high");
								} else {
									tempField.setBackground(Color.GREEN);
									tempField.setForeground(Color.BLACK);
									tempField.setToolTipText(null);
								}

								// tempList.get(startIndex + i).setText(String.valueOf(data.temp));

								fwdList.get(startIndex + i).setText(String.valueOf(data.fwd));

								rflList.get(startIndex + i).setText(String.valueOf(data.rfl));
							}
						});
					});
			Thread t = new Thread(handler);
			t.start();
			handler.setLans(temp);
			cardHandlers.put(card.id, handler);

			Thread.sleep(10);
		}

		ScheduledExecutorService logScheduler = Executors.newSingleThreadScheduledExecutor();
		logScheduler.scheduleAtFixedRate(() -> {

			for (ControlCard card : allCards) {

				ControlCardSocketHandler handler = cardHandlers.get(card.id);
				List<JToggleButton> toggles = toggleMap.get(card.id);

				if (handler != null && handler.isConnected()) {
					HardwareData data = handler.getLastData();
					if (data != null && data.paOn && toggles != null) {
						for (int i = 0; i < card.modules.size(); i++) {
							Module m = card.modules.get(i);
							JToggleButton button = toggles.get(i);

							if (button.isSelected()) {

								String time = LocalDateTime.now()
										.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

								String log = time + "Band: " + m.name + " | VSWR: " + data.vswr + " | TEMP: "
										+ data.temp + " | FWD: " + data.fwd + " | RFL: " + data.rfl;

								addLog(log);
							}
						}
					}
				}

			}

		}, 0, 5, TimeUnit.SECONDS);

		freqband_names_panel.setLayout(new GridLayout(count, 0, 0, 0));
		lan_checkbox_panel.setLayout(new GridLayout(count, 0, 0, 0));
		vswr_checkbox_panel.setLayout(new GridLayout(count, 0, 0, 0));
		temp_checkbox_panel.setLayout(new GridLayout(count, 0, 0, 0));
		fwd_textfields_panel.setLayout(new GridLayout(count, 0, 0, 0));
		rfl_textfields_panel.setLayout(new GridLayout(count, 0, 0, 0));

		addWindowListener(new WindowAdapter() {
			@Override
			public void windowClosing(WindowEvent e) {

				powerOffAllPAs(config); // off command before exit
			}
		});
		setVisible(true);
	}

	private void powerOffAllPAs(Config config) {
		for (PowerSupply psu : config.power_supplies) {
			PowerSupplySocketHandler psuHandler = psuHandlers.get(psu.id);
			if (psuHandler != null && psuHandler.isConnected()) {

				if (psu.id.equals("psu_02")) {
					psuHandler.enqueueCommand("CO.PS.S,0,0".getBytes());
				} else {

					for (ControlCard card : psu.control_cards) {
						if (card.off_command != null && !card.off_command.isEmpty()) {
							splitCmd(card.off_command, psuHandler);
							psuHandler.enqueueCommand(hexStringToBytes(card.off_command));
						} else {
							for (Module m : card.modules) {
								psuHandler.enqueueCommand(hexStringToBytes(m.power_off));
							}
						}
					}
				}
			}
		}
		for (ControlCard card : config.standalone_control_cards) {
			ControlCardSocketHandler handler = cardHandlers.get(card.id);
			if (handler != null && handler.isConnected()) {
				for (Module m : card.modules) {
					handler.enqueueCommand(hexStringToBytes(m.power_off));
				}
			}
		}
	}

	private byte[] hexStringToBytes(String hex) {
		if (hex == null || hex.trim().isEmpty()) {
			return new byte[0];
		}

		String[] parts = hex.trim().split(",");
		List<Byte> byteList = new ArrayList<>();

		for (String part : parts) {
			String value = part.trim();

			if (!value.isEmpty()) { // skip empty values
				byteList.add((byte) Integer.parseInt(value, 16));
			}
		}

		byte[] bytes = new byte[byteList.size()];
		for (int i = 0; i < byteList.size(); i++) {
			bytes[i] = byteList.get(i);
		}

		return bytes;
	}

	@Override
	public void dispose() {
		for (ControlCardSocketHandler handler : cardHandlers.values()) {
			handler.shutdown();
		}
		for (PowerSupplySocketHandler handler : psuHandlers.values()) {
			handler.shutdown();
		}
		super.dispose();
	}

	private void addLog(String msg) {
		SwingUtilities.invokeLater(() -> {
			try {
				Document doc = logPane.getDocument();

				SimpleAttributeSet attr = new SimpleAttributeSet();
				StyleConstants.setFontFamily(attr, "Arial");
				StyleConstants.setFontSize(attr, 14);
				StyleConstants.setBold(attr, true);
				StyleConstants.setForeground(attr, Color.BLUE);
				doc.insertString(doc.getLength(), msg + "\n", attr);
			} catch (BadLocationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		});
	}

	private void updateTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy hh:mm:ss a");
		label_Time.setText(sdf.format(new Date()));
	}

	private void splitCmd(String command, ControlCardSocketHandler handler) {

		String delimeter = "0d,0a";
		int index = command.indexOf(delimeter);
		if (index != -1) {
			String firstCmd = command.substring(0, index + delimeter.length());
			String secondCmd = command.substring(index + delimeter.length() + 1);

			byte[] first = hexStringToBytes(firstCmd);
			byte[] second = hexStringToBytes(secondCmd);

			handler.enqueueCommand(first);
			handler.enqueueCommand(second);
		}
	}

	private void updateCardStatus(String cardId, boolean isConnected) {
		SwingUtilities.invokeLater(() -> {

			JLabel lbl = statusLabels.get(cardId);

			if (lbl != null) {
				lbl.setBackground(isConnected ? Color.GREEN : Color.RED);
				lbl.setOpaque(true);
				lbl.revalidate();
				lbl.repaint();
			} else {
				System.out.println("Label not found for: " + cardId);
			}
		});
	}

	private void splitCmd(String command, PowerSupplySocketHandler psuhandler) {
		String delimeter = "0d,0a";
		int start = 0;
		while (true) {
			int index = command.indexOf(delimeter, start);
			if (index == -1)
				break;

			String cmdStr = command.substring(start, index);

			if (!cmdStr.trim().isEmpty()) {
				byte[] cmdBytes = hexStringToBytes(cmdStr);
				psuhandler.enqueueCommand(cmdBytes);
			}
			start = index + delimeter.length() + 1;
		}
	}
}
