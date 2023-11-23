import java.util.*;
public class Main_4 {

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        int num = scanner.nextInt();
        for (int i = 0; i < num; i++) {
            Stack<Character> stack1 = new Stack<Character>();
            String str = scanner.next();
            int cnt = 0;
            for (int j = 0; j < str.length(); j++) {
                if(str.charAt(j)=='('){
                    stack1.push('(');
                } else if(str.charAt(j)==')'){
                    if(stack1.isEmpty()){
                        cnt = -1;
                        break;
                    } else{
                        stack1.pop();
                    }

                }
            }
            if(stack1.isEmpty() == false){
                cnt = -1;
            }

            if(cnt != 0){
                System.out.println("NO");
            } else{
                System.out.println("YES");
            }
        }
    }
}
