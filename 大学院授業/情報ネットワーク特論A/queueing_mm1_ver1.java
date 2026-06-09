import java.util.*;
import java.io.*;
import java.util.Comparator;
import java.util.PriorityQueue;

public class queueing_mm1_ver1 {

	public static void main(String[] args) {

		double cur_time = .0;			// 現在時刻
		double uni_rand_val = .0;		// 一様分布に従う乱数
		double expo_val = .0;			// 指数分布に従う乱数
		double ar_average_val = 2.0;		// 到着平均時間
		double srv_average_val = 1.0;		// サービス平均時間
		double total_waiting_time = 0.0;	// 待ち行列で待たされた時間とサービス時間の合計（全ての客）

		// イベント表用の優先度キュー
		PriorityQueue<String> pri_queue = new PriorityQueue<String>(11,
			new Comparator<String>() {
				public int compare(String o1, String o2) {
					// 文字列"0.1:0"をコロンで区切り，左側（0番目）の文字列をdouble型に変換
					double x = Double.parseDouble(o1.split(":")[0].trim());
					double y = Double.parseDouble(o2.split(":")[0].trim());
					// 昇順にソート
					if (x > y) {
						return 1;
					} else {
						return -1;
					}
				}
			});

		// 待ち行列用のキュー
		Queue<String> rdy_queue = new LinkedList<String>();

		// サービス窓口用の配列
		ArrayList<String> srv_list = new ArrayList<String>();

		// pri_queue.add("0.1:0");
		// pri_queue.add("0.2:0");
		// pri_queue.add("0.5:0");
		// pri_queue.add("0.4:0");
		// pri_queue.add("0.3:0");

		// 到着イベントを生成（10000回）
		for(int i = 0; i < 10000; i++){

			uni_rand_val = Math.random();					// 一様分布に従う乱数の生成
			expo_val = -ar_average_val * Math.log(1.0 - uni_rand_val);	// 指数分布に従う乱数の生成
			cur_time = cur_time + expo_val;					// 現在時刻に指数分布に従う乱数を足す
			String DString = Double.toString(cur_time);			// double型を文字列に変換
			String evt = DString + ":0";					// 到着イベントなので，文字列の右側に":0"を結合
        		pri_queue.add(evt);						// 到着イベントをイベント表に挿入
		}

		// シミュレーション
		while (!pri_queue.isEmpty()) {						// イベント表が空になるまで繰り返す

			String evt = pri_queue.poll();					// イベント表からイベントを抜く

			String evt_time = evt.split(":")[0].trim();			// 文字列"0.1:0"をコロンで区切り，左側（0番目）の文字列
			String evt_type = evt.split(":")[1].trim();			// 文字列"0.1:0"をコロンで区切り，右側（1番目）の文字列

			String arrival = "0";						// 到着イベントの識別子（"0"とする）
			String departure = "1";						// 退去イベントの識別子（"1"とする）

			// イベントが到着の場合
			if (evt_type.compareTo(arrival) == 0) {				// イベント表からポップしたイベントが到着なら（"0"なら）...

				// System.out.println("0: -> READY:" + evt_time);

				String rdy0 = evt_time;
				rdy_queue.add(rdy0);					// 客（到着時刻の記述されている文字列とする）を待ち行列に挿入

				if (srv_list.isEmpty()) {				// サービス中の客がいないなら...

					// System.out.println("0: READY -> SERVICE:" + evt_time);

					String prdy0 = rdy_queue.poll();		// 待ち行列（キュー）から客を抜く．
					srv_list.add(0, prdy0);				// 客を窓口（配列）に挿入

					// イベント表に退去イベントを挿入
					uni_rand_val = Math.random();
					expo_val = -srv_average_val * Math.log(1.0 - uni_rand_val);
					cur_time = Double.parseDouble(evt_time) + expo_val;

					String DString0 = Double.toString(cur_time);
					String new_evt0 = DString0 + ":1";		// 退去イベントなので，文字列の右側に":1"を結合
		        		pri_queue.add(new_evt0);			// 退去イベントをイベント表に挿入

					// System.out.println("0: SERVICE END -> EVENT:" + new_evt0);

				}

			// イベントが退去の場合
			} else if (evt_type.compareTo(departure) == 0) {

				String srv1 = srv_list.get(0);
				srv_list.remove(0);					// 客を窓口（配列）から抜く

				// System.out.println("1: SERVICE END:" + evt_time);

				// 待ち行列で待たされた時間とサービス時間の合計
				double waiting_time = Double.parseDouble(evt_time) - Double.parseDouble(srv1);

				// 待ち行列で待たされた時間とサービス時間の合計（全ての客）
				total_waiting_time = total_waiting_time + waiting_time;

				// 表示してみる
				System.out.println("1: WAITING TIME:" + Double.toString(waiting_time));

				if (!rdy_queue.isEmpty()) {				// 待ち行列（キュー）に客が待っているなら...

					// System.out.println("1: READY -> SERVICE:" + evt_time);

					String prdy1 = rdy_queue.poll();		// 待ち行列（キュー）から客を抜く．
					srv_list.add(0, prdy1);				// 客を窓口（配列）に挿入

					uni_rand_val = Math.random();
					expo_val = -srv_average_val * Math.log(1.0 - uni_rand_val);
					cur_time = Double.parseDouble(evt_time) + expo_val;

					String DString1 = Double.toString(cur_time);
					String new_evt1 = DString1 + ":1";		// 退去イベントなので，文字列の右側に":1"を結合
		        		pri_queue.add(new_evt1);			// 退去イベントをイベント表に挿入

					// System.out.println("1: SERVICE END -> EVENT:" + new_evt1);

				}
			}
		}

		System.out.println((double)total_waiting_time/10000);				// 客1人あたりの待ち行列で待たされた時間とサービス時間
	}
}
