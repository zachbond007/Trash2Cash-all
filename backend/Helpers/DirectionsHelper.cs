using System;
namespace trash2cash_backend.Helpers
{
	public static class DirectionsHelper
	{
        public static double GetDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const int R = 6371; // Radius of the earth in km
            var dLat = DegreeToRadian(lat2 - lat1);
            var dLon = DegreeToRadian(lon2 - lon1);
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreeToRadian(lat1)) * Math.Cos(DegreeToRadian(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c; // Distance in km
            return d * 1000; // Distance in meters
        }

        public static double GetDistanceInMiles(double lat1, double lon1, double lat2, double lon2)
        {
            const int R = 3958; // Radius of the earth in miles
            var dLat = DegreeToRadian(lat2 - lat1);
            var dLon = DegreeToRadian(lon2 - lon1);
            var a =
                Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                Math.Cos(DegreeToRadian(lat1)) * Math.Cos(DegreeToRadian(lat2)) *
                Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            var d = R * c; // Distance in miles
            return d;
        }

        public static double DegreeToRadian(double deg)
        {
            return deg * (Math.PI / 180);
        }

    }
}

