sudo apt-get update
sudo apt-get -y install build-essential
sudo /opt/vagrant_ruby/bin/gem install jekyll rdiscount --no-ri --no-rdoc
sudo apt-get -y install nodejs npm
sudo npm config set registry http://registry.npmjs.org/
sudo npm install recess -g