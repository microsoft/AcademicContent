#!/bin/bash

#
# Purpose: Send e-mail using sendgrid api
#

echo Start sending email to $1

#https://app.sendgrid.com/settings/api_keys
apiKey="<sendgrid_api_key>" # set your api key
emailFrom="<email_from>"    # set email from

if [[ $apiKey == "<sendgrid_api_key>" ]]; then
	echo "The message will not be sent. Please specify <sendgrid_api_key>"
	exit 1
fi

if [[ $emailFrom == "<email_from>" ]]; then
	echo "The message will not be sent. Please specify <email_from>"
	exit 1
fi

emailTo=$1
subject="VM Information"
content="<html><h3>Hello, "$2"</h3><p>Computer: "$3"</p><p>OS type: "$4"</p><p>DNS: "$5"."$6".azure.cloudapp.com</p><p>User Name: "$7"</p><p>Password: "$8"</p></html>"

#send post request to sendgrid api
curl --request POST \
     --globoff \
     --url https://api.sendgrid.com/v3/mail/send \
     --header 'Authorization: Bearer '$apiKey \
     --header 'Content-Type: application/json' \
     --data \
		@<(cat <<EOF
{
	"personalizations": [{
			"to": [{
					"email": "$emailTo"
				}
			]
		}
	],
	"from": {
		"email": "$emailFrom"
	},
	"subject": "$subject",
	"content": [{
			"type": "text/html",
			"value": "$content"
		}
	]
}
EOF
)
echo Email $emailTo sent successfully
