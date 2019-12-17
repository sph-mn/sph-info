# code of the sph.mn website

# extra features
* for markdown
  * audio playlist
  * automatic documentation generation
  * create a table for a software list from csv
  * list input/output arguments of (sph test) test modules
* generated files
  * music directory listings

# deployment
* publish sph-info/content to /srv/http/sph-info/static
* link sph-info/dynamic/root to /srv/http/sph-info/dynamic/
* link sph-info/dynamic/temp to /srv/http/sph-info/temp

# server configuration
* [sph-web-app](https://github.com/sph-mn/sph-web-app) generated content is accessible under /dynamic
* [sph-web-publish](https://github.com/sph-mn/sph-web-publish) generated content is accessible under /
* an example configuration file is under other/nginx-example
