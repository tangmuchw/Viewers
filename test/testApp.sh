export TEST_BROWSER_DRIVER=puppeteer
export METEOR_PACKAGE_DIRS=../Packages

cd OHIFViewer

meteor test --once --driver-package meteortesting:mocha