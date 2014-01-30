#!/usr/bin/env DISABLE_AUTO_TITLE=true /bin/sh
# vim: set ft=sh:

# have to set the DISABLE_AUTO_TITLE for ohmyzsh to 
# stop auto naming tmux/screen windows

# NOTE: you will need nodemon installed if you want to use this
# npm install -g nodemon

# assuming file is <session>.tmux
SESS=`basename $0 '.tmux'`

tmux has-session -t $SESS 2> /dev/null
EXISTS=$?

if [ "$1" == "stop" ] ; then
    if [ $EXISTS != 0 ] ; then
        echo "'$SESS' did not exist"
        exit
    else
        # stop testem, server, and watch
        tmux send-keys -t $SESS:2 'q'
        tmux send-keys -t $SESS:3 'C-c'
        tmux send-keys -t $SESS:4 'C-c'

        # let them clean up
        sleep 1

        # exit their windows
        tmux send-keys -t $SESS:4 'exit' C-m
        tmux send-keys -t $SESS:3 'exit' C-m
        tmux send-keys -t $SESS:2 'exit' C-m

        # make user exit vim themselves
        tmux attach -t $SESS
    fi
fi

if [ $EXISTS != 0 ] ; then
    tmux new-session -s $SESS -n vim -d

    tmux send-keys -t $SESS:1 'vim' C-m

    # so the number of file descriptors that testem is juggling
    # to auto reload things can blow out the default setting
    # which causing some issues and testem crashing sometimes
    tmux new-window -t $SESS:2 -n testem -d
    tmux send-keys -t $SESS:2 'ulimit -n 10000' C-m
    tmux send-keys -t $SESS:2 'grunt testem:run:dev' C-m

    tmux new-window -t $SESS:3 -n server -d
    tmux send-keys -t $SESS:3 'nodemon ./api-stub/server.js' C-m

    tmux new-window -t $SESS:4 -n watch -d
    tmux send-keys -t $SESS:4 'ulimit -n 10000' C-m
    tmux send-keys -t $SESS:4 'grunt watch' C-m

    tmux select-window -t $SESS:1
    echo "'$SESS' created"
fi

if [ "$1" != "start" ] ; then
    echo "attaching to '$SESS'"
    tmux attach -t $SESS
fi
