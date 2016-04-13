var map;
        var marker;
        var infowindow;
        var canvas;
        function initialize()
        {
            var canvas = document.getElementById("canvas");
            var myCenter= new google.maps.LatLng(41.7852067,-1.2192938);
            var mapProp = {
                center:myCenter,
                zoom:15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            map = new google.maps.Map(canvas,mapProp);


            google.maps.event.addListener(map, 'click', function(event) {
                placeMarker(event.latLng);
            });

            map.setOptions({ draggableCursor: 'crosshair' });

            /*var noPoi = [{
                featureType: "poi",
                stylers: [
                    { visibility: "off" }
                ]
            }];
            map.setOptions({styles: noPoi});*/

        }

        var retrying = false;

        function placeMarker(location) {
            var geocoder = new google.maps.Geocoder;

            geocoder.geocode({'location': location}, function(results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    if (results[0]) {

                        if(typeof marker === 'undefined'){
                            marker = new google.maps.Marker({
                                position: location,
                                map: map,
                            });

                            infowindow = new google.maps.InfoWindow({
                                content: results[0].formatted_address
                            });

                            infowindow.set('isCustomInfoWindow',true);

                            var fnSet = google.maps.InfoWindow.prototype.set;
                            google.maps.InfoWindow.prototype.set = function () {
                                if(this.get('isCustomInfoWindow'))
                                   fnSet.apply(this, arguments);
                            };



                        }else{
                            marker.setPosition(location);
                            infowindow.setContent(results[0].formatted_address);
                        }

                        jQuery('.form-map input[name="lugar[latitud]"]').val(location.lat());
                        jQuery('.form-map input[name="lugar[longitud]"]').val(location.lng());
                        jQuery('.form-map input[name="lugar[direccion]"]').val(results[0].formatted_address);

                        jQuery('.form-map input[type=submit]').removeAttr('disabled');

                        infowindow.open(map,marker);
                    } else {
                        window.alert('Error: no hay resultados');
                    }
                } else {
                    console.warn('Geocoder failed due to: ' + status);
                    if (status == 'OVER_QUERY_LIMIT' && retrying == false) {
                        console.warn('Retrying...');
                        retrying =  true;
                        map.setOptions({ draggableCursor: 'wait' });
                        setTimeout(function() {
                            retrying = false;
                            map.setOptions({ draggableCursor: 'crosshair' });
                            placeMarker(location);
                            console.log('fired');
                        }, 500);
                    }
                }
            });

        }

            

        function resize(){
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        }

        google.maps.event.addDomListener(window, 'load', initialize);
        google.maps.event.addDomListener(window, "resize", resize);

        jQuery(document).ready(function(){
            jQuery('.resize').click(function(){
                resize();
            });
        });
