//
//  HomeViewController.swift
//  CampusSafety
//
//  Created by Aarya BC on 11/11/17.
//  Copyright © 2017 Aarya BC. All rights reserved.
//

import UIKit
import Parse
import CoreLocation

class HomeViewController: UIViewController, CLLocationManagerDelegate{
    
    let locationManager = CLLocationManager()
    
    
    @IBOutlet weak var trackMeButton: UIButton!
    var tracking = true
    var safety = true
    var objectId = ""
    var color = "green"
    
    @IBAction func getLocation(_ sender: Any) {
        if (tracking){
            locationManager.delegate = self
            locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
            locationManager.requestWhenInUseAuthorization()
            locationManager.startUpdatingLocation()
            self.tracking = false
            self.trackMeButton.setTitle("I'm Safe", for: .normal)
        }
        else{
            self.trackMeButton.setTitle("Track Me", for: .normal)
            locationManager.stopUpdatingLocation()
        }
    }
    
    @IBAction func getHelp(_ sender: Any) {
        self.safety = false
        self.color = "red"
    }
    
    //get location
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        
        CLGeocoder().reverseGeocodeLocation(manager.location!, completionHandler: {(placemarks, error) ->Void in
                if (error != nil) {
                    print("Reverse geocoder failed with error" + (error?.localizedDescription)!)
                    return
                }
                print("in here")
                if (placemarks?.count)! > 0 {
                    let pm = placemarks?[0]
                    let query = PFQuery(className: "Location")
                    query.getObjectInBackground(withId: self.objectId) {(object, error) in
                        if error == nil{
                            object!["latitude"] = pm!.location?.coordinate.latitude
                            object!["longitude"] = pm!.location?.coordinate.longitude
                            object!["color"] = self.color
                            object!["safe"] = self.safety
                            object?.saveInBackground()
                        }
                    }
                } else {
                    print("Problem with the data received from geocoder")
                }
            })
    }
    
    //error for location
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        print("Error while updating location " + error.localizedDescription)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let post = PFObject(className: "Location")
        post["latitude"] = 0;
        post["longitude"] = 0;
        post["safe"] = self.safety;
        post["color"] = self.color
        post.saveInBackground();
        
        let query = PFQuery(className: "Location");
        query.findObjectsInBackground { (objects, error) in
            if error == nil{
                if let returnedobjects = objects {
                    self.objectId = returnedobjects[returnedobjects.count - 1].objectId!;
                }
            }
        }
    }
}
