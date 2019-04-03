#!/bin/bash
INPUT=/mnt/c/Users/xxx/yourfilepath/students.csv
dos2unix $INPUT
OLDIFS=$IFS
IFS=,
[ ! -f $INPUT ] && { echo "$INPUT file not found"; exit 99; }
ad="xxxx.onmicrosoft.com"
while read name login password sub
do

        azure ad user create $login@$ad $name $login $password
        azure account set $sub
        azure role assignment create --signInName $login@$ad --roleName Contributor
        echo  "creation done for " +$login
        done < $INPUT
IFS=$OLDIFS
