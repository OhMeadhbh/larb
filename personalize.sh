#!/bin/bash
#
# Personalize the Node.JS Appliance by adding a new user account, generate
# openssh server keys if they don't exist and creating ~/.ssh/authorized_keys
MINPARAMS=3

if [ $# -lt $MINPARAMS ]; then
  echo "%LARB-F-USAGE; Usage is:"
  echo ";   personalize.sh <Full Name> <Login Name> <Password>"
  echo "; where:"
  echo ";   Full Name - the user's given name"
  echo ";   Login Name - the user's unix login name"
  echo ";   Password - the user's password."
  exit 1
fi

FULLNAME=$1
USERNAME=$2
PASSWORD=$3

if [ ! -e /etc/ssh/ssh_host_dsa_key ]; then
  echo "%LARB-I-OPENSSH; Generating new openssh server keys."
  /usr/sbin/dpkg-reconfigure openssh-server
fi

echo "%LARB-I-UNIX; Adding Unix account for $USERNAME."
echo "$PASSWORD
$PASSWORD
" | /usr/sbin/adduser --gecos "$FULLNAME" --conf /opt/larb/adduser.conf $USERNAME

echo "%LARB-I-SAMBA; Adding Samba account for $USERNAME."
echo "$PASSWORD
$PASSWORD
" | /usr/bin/smbpasswd -a -s $USERNAME

if [ ! -e /home/$USERNAME/.ssh ]; then
  echo "%LARB-I-SSHDIR; Creating user's ~/.ssh directory."
  mkdir /home/$USERNAME/.ssh
  chown $USERNAME /home/$USERNAME/.ssh
  chgrp $USERNAME /home/$USERNAME/.ssh
  chmod 700 /home/$USERNAME/.ssh
fi

echo "%LARB-I-AUTHKEY; Adding authorized key to user's ~/.ssh/authorized_keys."
tr -d '\n\r' >> /home/$USERNAME/.ssh/authorized_keys
chown $USERNAME /home/$USERNAME/.ssh/authorized_keys 
chgrp $USERNAME /home/$USERNAME/.ssh/authorized_keys
chmod 600 /home/$USERNAME/.ssh/authorized_keys

echo "%LARB-S-W00T; Personalization process completed."
exit 0
