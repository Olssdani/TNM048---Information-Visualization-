/**
 * @Created Jan 25, 2018
 * @LastUpdate Jan 31, 2019
 * @author Kahin Akram
 */

function kmeans(data, k) {
    
    //Crap we need
    var iterations = 0;
    var maxLoops = 5;
    var iterations = 0;
    var qualityChange = 0;
    var oldqualitycheck = 0; 
    var qualitycheck = 0;
    var converge = false;

    //Parse the data from strings to floats
    var new_array = parseData(data);
    //Task 4.1 - Select random k centroids 
    var centroid = initCentroids(new_array,k);

    //Prepare the array for different cluster indices
    var clusterIndexPerPoint = new Array(new_array.length).fill(0);

    //Task 4.2 - Assign each point to the closest mean.
    clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);
    //Master loop -- Loop until quality is good
    var counter =0;
    var pQualitycheck = 0;
    do {

        //Task 4.3 - Compute mean of each cluster
        centroid = computeClusterMeans(new_array, clusterIndexPerPoint, k);
        // assign each point to the closest mean.
        var clusterIndexPerPoint = assignPointsToMeans(new_array, centroid);

        //Task 4.4 - Do a quality check for current result
        var qualitycheck = qualityCheck(centroid,new_array,clusterIndexPerPoint);
        
        var diff = Math.abs(pQualitycheck-qualitycheck);
        //End the loop if diff is smaller than a threshold
        if(diff < 0.0000001 )
        {
        	converge = true;
        }
        //Set Pqualitycheck to qualityCheck
        pQualitycheck = qualitycheck;
        //Increae counter 
        counter ++;

    }
    while (converge == false)
    console.log(counter);
    //Return results 
    return {
        assignments: clusterIndexPerPoint
    };

}

/**
 * Parse data from strings to floats
 * Loop over data length
      loop over every i in data
        Fill array with parsed values, use parseFloat
 * @param {*} data 
 * @return {array}
 */
function parseData(data){

    
    //Get nr of attributes in each object
    var NrOfAttributes =Object.keys(data[0]).length;
    //Get nr of objects
    var NrOfObjects =data.length;
   	var array = [];
    for(var i=0; i<NrOfObjects; i++)
    {
        //Get a point from data
        var point = data[i];
        var temp = [];
        //Loop over nr of datatypes in object
        for(var j =0; j<NrOfAttributes;j++)
        {
            //Get and parse the data
            temp.push(parseFloat(point[Object.keys(point)[j]]));

        }
        array.push(temp);
    }
    return array;
}

/**
 * Task 4.1 - Randomly place K points
 * Loop over the centroids
 * Loop over data and Use floor and random in Math
 * @return {array} centroid 
 */

function initCentroids(data, k){
   
    var centroid = [];
    //Create k centroids
    for(var i =0; i<k; i++)
    {
        var randomValue = Math.random();
        var index = Math.floor(randomValue*data.length); 

        centroid.push(data[index]);
    }
    return centroid;
}

/**
* Taks 4.2 - Assign each item to the cluster that has the closest centroid
* Loop over points and fill array, use findClosestMeanIndex(points[i],means)
* Return an array of closest mean index for each point.
* @param points
* @param means
* @return {Array}
*/
function assignPointsToMeans(points, means){
    var assignments = new Array(points.length).fill(0);
    for(var i =0; i<points.length; i++)
    {
    	assignments[i] = findClosestMeanIndex(points[i], means);
    }
    return assignments;
};
/**
 * Calculate the distance to each mean, then return the index of the closest.
 * Loop over menas and fill distance array, use euclideanDistance(point,means[i])
 * return closest cluster use findIndexOfMinimum,
 * @param point
 * @param means
 * @return {Number}
*/
function findClosestMeanIndex(point, means){
    var distances = new Array(means.length).fill(0);
    for(var i =0; i<means.length; i++)
    {
    	distances[i] = euclideanDistance(point,means[i]);
    }
    return findIndexOfMinimum(distances);
};
/**
 * Euclidean distance between two points in arbitrary dimension(column/axis)
 * @param {*} point1 
 * @param {*} point2 
 * @return {Number}
 */

function euclideanDistance(point1, point2){

    if (point1.length != point2.length)
        throw ("point1 and point2 must be of same dimension");

    var sum = Math.sqrt(Math.pow(point1[0]-point2[0],2)+Math.pow(point1[1]-point2[1],2)+Math.pow(point1[2]-point2[2],2));
    return sum;

};

/**
 * Return the index of the smallest value in the array.
 *  Loop over the array and find index of minimum
 * @param array
 * @return {Number}
 */
function findIndexOfMinimum(array){
    var index = 0;
    var min = 1000000;
  	for(var i =0; i<array.length; i++)
  	{
  		if(min > array[i])
  		{

  			min = array[i];
  			index = i;
  		}
  	}
    return index;
};

/**
 * //Task 4.3 - Compute mean of each cluster 
 * For each cluster loop over assignment and check if ass. equal to cluster index
 * if true fill array 
 * then if array is not empty fill newMeans, use averagePosition(array)
 * @param {*} points 
 * @param {*} assignments 
 * @param {*} k 
 * @returns {array}
 */
function computeClusterMeans(points, assignments, k){
    
    if (points.length != assignments.length)
        throw ("points and assignments arrays must be of same dimension");
    // for each cluster
    var newMeans = [];

    //Loop over number of cluster
    for(var i =0; i<k ; i++)
    {
    	//Variable that hold points in that cluster
    	var p = [];
    	//Loop over assignment
    	for(var j =0; j<assignments.length ; j++)
    	{
    		//Check if that point lies in that cluster
    		if(assignments[j] == i)
    		{
    			p.push(points[j]);
    		}
    	}
    	//Recalculate the new means
    	newMeans[i] = averagePosition(p);
    	
     }


    return newMeans;
};

/**
 * Calculate quality of the results
 * For each centroid loop new_array and check if clusterIndexPerPoint equal clsuter
 * if true loop over centriod and calculate qualitycheck.
 * @param {*} centroid 
 * @param {*} new_array 
 * @param {*} clusterIndexPerPoint 
 */
function qualityCheck(centroid, new_array, clusterIndexPerPoint){
    var qualitycheck = 0;
    for(var i =0; i<centroid.length ; i++)       
    {
        var quality =0;

        for(var j =0; j < clusterIndexPerPoint.length; j++)
        {

            if(clusterIndexPerPoint[j] ==i)
            {
                
                quality +=Math.pow(euclideanDistance(new_array[j],centroid[i]),2);
            }
        }
        qualitycheck +=quality;
    } 
    return qualitycheck;
}

/**
 * Calculate average of points
 * @param {*} points 
 * @return {number}
 */
function averagePosition(points){
    
    var sums = points[0];
    for (var i = 1; i < points.length; i++){
        var point = points[i];
        for (var j = 0; j < point.length; j++){
            sums[j] += point[j];
        }
    }

    for (var k = 0; k < sums.length; k++)
        sums[k] /= points.length;

    return sums;
};