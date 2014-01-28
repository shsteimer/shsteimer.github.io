sudo apt-get update
sudo apt-get -y install build-essential
sudo /opt/vagrant_ruby/bin/gem install jekyll rdiscount --no-ri --no-rdoc

sudo apt-get -y install python-software-properties python g++ make
sudo add-apt-repository ppa:chris-lea/node.js -y
sudo apt-get update
sudo apt-get -y install nodejs

sudo npm install -g grunt-cli
cd /vagrant
npm install --no-bin-link
grunt