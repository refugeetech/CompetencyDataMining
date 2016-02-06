#!/bin/sh
curl -H "Accept-Language: json" http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesomraden > yrkesomraden.json
curl -H "Accept-Language: json" http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=1 > adminEkonomiJuridik.json
curl -H "Accept-Language: json" http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=8 > halsoSjukvard.json
#curl -H "Accept-Language: json" http://api.arbetsformedlingen.se/af/v0/platsannonser/soklista/yrkesgrupper?yrkesomradeid=1 > yrkesomraden.json
