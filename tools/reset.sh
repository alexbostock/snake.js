#!/usr/bin/env sh
# Stop the server (given the server key)

if [ "$1" == "local" ]
then
	curl -X POST "http://localhost:8000/admin/reset/$2"
fi

if [ "$1" == "live" ]
then
	curl -X POST "https://alexbostock.co.uk/admin/reset/$2"
fi

