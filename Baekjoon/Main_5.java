import java.util.*;
import java.io.*;

public class Main_5 { //백준 4949

    public static void main(String[] args) throws IOException{
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in)); //한번에 문단을 읽음
        StringBuilder builder = new StringBuilder();
        String str;

        while(true){
            str = reader.readLine(); // 읽어드린 문단을 한줄 씩 읽음

            if(str.equals(".")){  // 종료조건이 "."이기 때문
                break;
            }
            builder.append(solution(str)).append('\n');
        }
        System.out.println(builder);
    }

    public static String solution(String s) {
        Stack<Character> stack = new Stack<Character>();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);

            if (c == '(' || c == '[') {
                stack.push(c);
            }
            else if (c == ')'){
                if (stack.isEmpty() || stack.peek() != '(') {
                    return "no";
                }
                else {
                    stack.pop();
                }
            }

            else if (c == ']') {
                if (stack.isEmpty() || stack.peek() != '[') {
                    return "no";
                } else {
                    stack.pop();
                }
            }

        }
        if (stack.isEmpty()) {
            return "yes";
        } else {
            return "no";
        }
    }
}
