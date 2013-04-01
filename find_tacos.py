import json as simplejson
import urllib
import hashlib


GEOCODE_BASE_URL = 'http://maps.googleapis.com/maps/api/geocode/json'

SHOPS = [
    ("La Taqueria", "2889 Mission St"),
    ("Tacqueria Altena", "2588 Mission St"),
    ("El Taco Loco", "3274 24th St"),
    ("Taquerias El Farolito", "2779 Mission St"),
    ("Taquerias El Farolito", "2950 24th St"),
    ("La Corneta Taqueria", "2731 Mission St"),
    ("Taqueria Vallarta", "3039 24th St"),
    ("Tacolicious", "741 Valencia St"),
    ("Taqueria Cancun", "2288 Mission St"),
]


def get_hash(place_name, place_addr):
    return hashlib.sha224(place_name + place_addr).hexdigest()[:10]


def geocode(shop, sensor, **geo_args):
    geo_args.update({
        'address': shop[1] + ", San Francisco",
        'sensor': sensor
    })

    url = GEOCODE_BASE_URL + '?' + urllib.urlencode(geo_args)
    result = simplejson.load(urllib.urlopen(url))

    data = result['results'][0]

    single_result = {
        "name": shop[0],
        "addr": shop[1],
        "hash": get_hash(shop[0], shop[1])
    }

    loc = data['geometry']['location']

    single_result['lat'] = loc['lat']
    single_result['lng'] = loc['lng']

    return single_result


if __name__ == '__main__':

    output = []

    for shop in SHOPS:
        result = geocode(shop=shop, sensor="false")
        output.append(result)

    print output
    obj = open('data.js', 'wb')
    obj.write(simplejson.dumps(output, indent=4, sort_keys=True))
    obj.close
