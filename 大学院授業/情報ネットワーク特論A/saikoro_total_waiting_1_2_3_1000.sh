#!/bin/sh

for i in `seq 1000`
do
/usr/bin/java saikoro_ran_sample 1 >> total_waiting_ave1_trial1000.txt
done

for i in `seq 1000`
do
/usr/bin/java saikoro_ran_sample 2 >> total_waiting_ave2_trial1000.txt
done

for i in `seq 1000`
do
/usr/bin/java saikoro_ran_sample 10 >> total_waiting_ave3_trial1000.txt
done

for i in `seq 1000`
do
/usr/bin/java saikoro_ran_sample 1000 >> total_waiting_ave1000_trial1000.txt
done
