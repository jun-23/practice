import java.io.*;
import java.util.*;

public class Main_2 {
    static Stack<Integer> stack = new Stack<>();

    public static void main(String[] args) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(System.out));

        int num = Integer.parseInt(reader.readLine());
        int[][] queries = new int[num][2];

        for (int i = 0; i < num; i++) {
            String[] input = reader.readLine().split(" ");
            queries[i][0] = Integer.parseInt(input[0]);
            if (queries[i][0] == 1) {
                queries[i][1] = Integer.parseInt(input[1]);
            }
        }

        for (int i = 0; i < num; i++) {
            int n = queries[i][0];
            solution(n, queries[i][1], writer);
        }

        writer.flush();
        writer.close();
        reader.close();
    }

    public static void solution(int n, int value, BufferedWriter writer) throws IOException {
        switch (n) {
            case 1:
                stack.push(value);
                break;
            case 2:
                if (stack.isEmpty()) {
                    writer.write("-1\n");
                } else {
                    writer.write(stack.pop() + "\n");
                }
                break;
            case 3:
                writer.write(stack.size() + "\n");
                break;
            case 4:
                writer.write((stack.isEmpty() ? 1 : 0) + "\n");
                break;
            case 5:
                writer.write((stack.isEmpty() ? -1 : stack.peek()) + "\n");
                break;
        }
    }
}
