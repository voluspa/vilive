#!/usr/bin/env DISABLE_AUTO_TITLE=true /bin/sh
# vim: set ft=sh:

# have to set the DISABLE_AUTO_TITLE for ohmyzsh to
# stop auto naming tmux/screen windows

# assuming file is <session>.tmux
SESS=`basename $0 '.tmux'`

tmux has-session -t $SESS 2> /dev/null
EXISTS=$?

if [ $EXISTS != 0 ] ; then

    tmux new-session -s $SESS -n editor -d

    tmux send-keys -t $SESS:1 'vim' C-m
    tmux split-window -h -p 35 -t $SESS:1
    # so the number of file descriptors that testem is juggling
    # to auto reload things can blow out the default setting
    # which can cause some issues and testem crashing sometimes
    tmux send-keys -t $SESS:1.2 'ulimit -n 10000' C-m
    tmux send-keys -t $SESS:1.2 'ember server' C-m

    tmux select-window -t $SESS:1
    echo "'$SESS' created"

fi

if [ "$1" != "start" ] ; then
    echo "attaching to '$SESS'"
    tmux attach -t $SESS
fi
