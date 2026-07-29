import java.util.Random;

public class expo_ran_sample_hist {
    public static void main(String[] args){
	double uni_rand_val = .0;
	double expo_val = .0;
	double average_val = 2.0;

	int kaikyu = 0;
	int[] val_array = new int[100];

	for (int i = 0; i < 100; i++) {
		val_array[i] = 0;
	}

	for(int i = 0; i < 10000; i++){
		uni_rand_val = Math.random();
		expo_val = -average_val * Math.log(1.0 - uni_rand_val);
		// expo_val = -average_val * Math.log(1.0 - Math.random());
        	System.out.println(expo_val);

		kaikyu = (int)(expo_val * 10);
		if (kaikyu < 100) {
			val_array[kaikyu]++;
		}
		System.out.println(kaikyu);
	}

	for (int i = 0; i < 100; i++) {
		System.out.println(val_array[i]);
	}
    }
}
