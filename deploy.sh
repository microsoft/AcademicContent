#!/usr/bin/env sh

if [ "$1" == "" ] || [ "$2" == "" ] || [ "$3" == "" ]; then
    echo "Usage: ./deploy.sh <org> <username> <password>"
    echo "<org> is the name of the GitHub org to push to"
    echo "<username> is the username of the GitHub user pushing this"
    echo "<password> is the password of the GitHub user pushing this"
    exit -1
fi

# abort on errors
set -e

# build
npm run docs:build

# navigate into the build output directory
cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f https://$2:$3@github.com/$1/AcademicContent.git master:gh-pages

cd -
