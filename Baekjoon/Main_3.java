import java.io.*;
import java.util.*;


public class Main_3 {
    public static void main(String args[]) throws IOException {
        Scanner scanner = new Scanner(System.in);
        Stack<Integer> stack = new Stack<Integer>();
        int num = scanner.nextInt();
        for(int i = 0; i < num; i++) {
            int query = scanner.nextInt();
            if (query == 0) {
                stack.pop();
            } else {
                stack.push(query);
            }
        }
        int sum = 0;

        for(int i : stack){
            sum += i;
        }
        System.out.println(sum);



    }
}
