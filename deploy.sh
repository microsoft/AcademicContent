#!/usr/bin/env sh

# if [ "$1" == "" ]; then
#     echo "Usage: ./deploy.sh <org>"
#     echo "Where <org> is the name of the GitHub org to push to"
#     exit -1
# fi

# abort on errors
set -e

# copy files around
cp ./CONTRIBUTING.md ./docs

# build
npm run docs:build

# navigate into the build output directory
# cd docs/.vuepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# git init
# git add -A
# git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:$1/computerscience.git master:gh-pages

# cd -