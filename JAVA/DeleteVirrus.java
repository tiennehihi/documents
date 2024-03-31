import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class DeleteVirrus {
    public static final String[] EXTENSION = { ".exe", ".bat" };

    public static void main(String[] args) throws IOException {
        System.out.println("Nhap duong dan toi thu muc can quet:");
        String thuMuc = System.console().readLine();
        List<File> danhSachTep = duyetThuMuc(thuMuc);
        int soLuongExeBat = demTepExeBat(danhSachTep);
        System.out.println("Hien thi danh sach tep:");
        for (File tep : danhSachTep) {
            if (isExeBatFile(tep)) {
                System.out.println(tep.getAbsolutePath());
            }
        }
        System.out.println("So luong tep exe, bat: " + soLuongExeBat);
    }

    private static List<File> duyetThuMuc(String thuMuc) {
        List<File> danhSachTep = new ArrayList<File>();
        File file = new File(thuMuc);
        if (file.isDirectory()) {
            for (File tepCon : file.listFiles()) {
                danhSachTep.addAll(duyetThuMuc(tepCon.getAbsolutePath()));
            }
        } else {
            danhSachTep.add(file);
        }
        return danhSachTep;
    }

    private static int demTepExeBat(List<File> danhSachTep) {
        int count = 0;
        for (File tep : danhSachTep) {
            if (isExeBatFile(tep)) {
                count++;
            }
        }
        return count;
    }

    private static boolean isExeBatFile(File tep) {
        String tenTep = tep.getName().toLowerCase();
        for (String extension : EXTENSION) {
            if (tenTep.endsWith(extension.trim())) {
                return true;
            }
        }
        return false;
    }
}
