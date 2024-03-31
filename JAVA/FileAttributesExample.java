import java.io.File;
import java.io.IOException;

public class FileAttributesExample {
    public static void main(String[] args) {
        // Create object File from path of file example.txt
        File file = new File("example.txt");

        // Check empty
        if (file.exists()) {
            System.out.println("Name file: " + file.getName());
            System.out.println("Path: " + file.getAbsolutePath());
            System.out.println("Length: " + file.length() + " bytes");

            // Check the file's read and write permissions
            System.out.println("Can read: " + file.canRead());
            System.out.println("Can write: " + file.canWrite());
            
            // Change the file's read and write permissions
            file.setReadable(false);
            file.setWritable(false);

            // Check if permissions have changed
            System.out.println("After change permissions:");
            System.out.println("Can read: " + file.canRead());
            System.out.println("Can write: " + file.canWrite());
        } else {
            System.out.println("File not found.");
        }
    }
}
