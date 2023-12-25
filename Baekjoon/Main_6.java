import java.util.*;
public class Main_6 { //피보나치를 재귀와 동적 계획법의 횟수 비교

    public static int fib_r(int n, int cnt){
        if(n==1 || n == 2){
            cnt++;
            return 1;
        } else{
            return fib_r(n-1,cnt) + fib_r(n-2,cnt);
        }
    }

    public static int fib_dp(int n){
        int cnt = 0;
        int arr[] = new int[n+1];
        arr[1] = 1;
        arr[2] = 1;
        for(int i = 3; i <= n; i++){
            arr[i] = arr[i-1] + arr[i-2];
            cnt++;
        }
        return cnt;
    }
    public static void main(String[] args){
        Scanner scanner = new Scanner(System.in);
        int n = scanner.nextInt();
        int r = fib_r(n,0);
        int dp = fib_dp(n);
        System.out.println(r + " " + dp);
    }
}
