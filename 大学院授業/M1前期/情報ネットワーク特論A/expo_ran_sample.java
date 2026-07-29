import java.util.Random;

public class expo_ran_sample {
    public static void main(String[] args){
	double uni_rand_val = .0;
	double expo_val = .0;
	double average_val = 2.0;

	for(int i = 0; i < 10000; i++){
		uni_rand_val = Math.random();
		expo_val = -average_val * Math.log(1.0 - uni_rand_val);
		// expo_val = -average_val * Math.log(1.0 - Math.random());
        	System.out.println(uni_rand_val);
        	System.out.println(expo_val);
	}
    }
}
