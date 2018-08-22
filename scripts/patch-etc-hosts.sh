#!/bin/bash
for host in prod.foo.redhat.com stage.foo.redhat.com qa.foo.redhat.com ci.foo.redhat.com
do
    grep -q $host /etc/hosts 2>/dev/null
    if [ $? -ne 0 ]
    then
        echo "Adding $host to /etc/hosts"
        echo "127.0.0.1 $host" >>/etc/hosts
    fi
done
