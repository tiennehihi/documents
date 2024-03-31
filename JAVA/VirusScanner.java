import java.io.File;

public class VirusScanner {
    // Ham de quy duyet tat ca cac tep tin trong thu muc
    public static void scanDirectory(File folder) {
        File[] files = folder.listFiles();
        if (files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    scanDirectory(file); // Neu la thu muc tiep tuc de quy
                } else {
                    // Neu la tep tin exe hoac bat thì kiem tra
                    if (file.getName().endsWith(".exe") || file.getName().endsWith(".bat")) {
                        System.out.println("Tep tin co duoi exe hoac bat: " + file.getAbsolutePath());
                    }
                }
            }
        }
    }

    public static void main(String[] args) {
        // Duong than thu muc toi o dia quet
        String folderPath = "C:\\";
        File folder = new File(folderPath);

        // Kiem tra xem duong dan co ton tai va la thu muc hay khong
        if (folder.exists() && folder.isDirectory()) {
            // Duyet thu muc
            scanDirectory(folder);
        } else {
            System.out.println("Thu muc khong ton tai hoac khong hop le.");
        }
    }
}
