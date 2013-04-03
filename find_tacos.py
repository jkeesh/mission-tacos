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
    ("Taqueria El Buen Sabor", "699 Valencia St"),
    ("Casa Sanchez", "2778 24th St"),
    ("Taqueria El Castillito", "2092 Mission St"),
    ("Taqueria Los Coyotes", "3036 16th St"),
    ("La Cumbre Taqueria", "515 Valencia St"),
    ("El Faro", "2399 Folsom St"),
    ("El Gallo Giro Taco Truck", "23rd St & Treat St"),
    ("La Pinata", "2471 Mission St"),
    ("El Metate", "2406 Bryant St"),
    ("El Tonayense", "2560 Marin Street"),
    ("La Palma", "2884 24th St"),
    ("Pancho Villa Taqueria", "3071 16th St"),
    ("Papalote Mexican Grill", "3409 24th St"),
    ("La Parrilla Grill", "2801 Folsom St"),
    ("Taqueria Guadalajara", "3146 24th St"),
    ("Taqueria San Francisco", "2794 24th St"),
    ("Taqueria San Jose", "2830 Mission St"),
    ("Elsy's Restaurant", "2893 Mission St"),
    ("El Gran Taco Loco", "3306 Mission St"),
    ("El Tepa Taqueria", "2198 Folsom St"),
    ("El Toro Taqueria", "598 Valencia St"),
    ("La Espiga De Oro", "2916 24th St"),
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
