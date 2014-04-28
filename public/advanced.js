// function Course(crn, time, days, type) {
//     this.crn = crn
//     this.time = time
//     this.days = days
//     this.Type = Type
// }

// // var a = new Course(1, "10:00 AM - 10:50 AM", "MWF", "Lec")
// // var b = new Course(2, "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "M\nM", "Discussion/Recitation\nLaboratory")
// // var c = new Course(3, "02:00 PM - 02:50 PM\n03:00 PM - 03:50 PM", "M\nM", "Discussion/Recitation\nLaboratory")
// // var e = [Course1, Course2, Course3]
// // var d = e[0].sections
// // var f = e[1].sections
// // d[0] = a
// // d[1] = b
// // d[2] = c
// var a = {crn:"1", time:"10:00 AM - 10:50 AM", day:"MWF", Type:"Lec", availbility:"open"}
// var b = {crn:"2", time:"01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", day:"M\nM", Type:"Discussion/Recitation\nLaboratory", availbility:"open"}
// var c = {crn:"3", time:"02:00 PM - 02:50 PM\n03:00 PM - 03:50 PM", day:"M\nM", Type:"Discussion/Recitation\nLaboratory", availbility:"open"}
// var cs411 = []
// cs411.push(a)
// cs411.push(b)
// cs411.push(c)
// console.log(cs411)
// var schedule1 = genClass(cs411)
// // console.log(schedule1)
// var d = {crn:"4", time:"11:00 AM - 11:50 AM", day:"MWF", Type:"Lec", availbility:"open"}
// var e = {crn:"5", time:"03:00 PM - 04:50 PM", day:"M", Type:"Discussion/Recitation", availbility:"open"}
// var f = {crn:"6", time:"05:00 PM - 06:50 PM", day:"M", Type:"Discussion/Recitation", availbility:"open"}
// var cs421 = []
// cs421.push(d)
// cs421.push(e)
// cs421.push(f)
// // console.log(cs421)
// var schedule2 = genClass(cs421)
// // console.log(schedule2)
// var final = genPermutation(schedule1, schedule2)
// console.log()
// console.log(final)

var sampleharlenoutput = [
    {"CourseID":"cs411",
        "Sections": [
            {"Section" : "AL1", "Time" : "01:00 PM - 01:50 PM\n02:00 PM - 02:50 PM", "Days":"M\nM", "Type":"Discussion/Recitation\nLaboratory", "Availability" : "open"}
        ]},
    {"CourseID":"cs421",
        "Sections": [
            {"Section" : "AL6", "Time" : "03:00 PM - 03:50 PM", "Days":"F", "Type":"Lecture", "Availability" : "open"},
            {"Section" : "AL5", "Time" : "10:00 AM - 01:50 PM", "Days":"TR", "Type":"Discussion/Recitation", "Availability" : "open"}
        ]
    }
]
var json = processJSON(sampleharlenoutput)
console.log()
console.log(json)


/*
 input = list of courses [course1, course2,...]
 */
function processJSON(input){
    var list = []
    for (var i = 0; i < input.length; ++i)
    {
        // add courseID field to section
        for (var k = 0; k < input[i].Sections.length; ++k)
        {
            input[i].Sections[k]["CourseID"] = input[i].CourseID    
        }
        var sections = genClass(input[i].Sections)
        // console.log(sections)
        list.push(sections)
        // for (var j = 0; j < sections.length; ++j)
        // {
        //     input[j].Sections = sections
        //     list.push(input[j])
        // }
    }
    // console.log(list)
    
    var final = [[]]
    for (var j = 0; j < list.length; ++j){
        final = genPermutation(final,list[j])
    }
    // console.log(final)
    return final
}

/*
 CourseList = list of sections
 requires time, day, availbility attributes
 */
function genClass(CourseList) {
    // console.log(CourseList)
    // finds out different types and split into bins
    var type = {}
    for (var i=0; i<CourseList.length; i++)
    {
        var Course = CourseList[i]
        if (!(Course.Type in type))
        {
            type[Course.Type] = []
        }
        type[Course.Type].push(Course)
    }
    // checks if there is atleast 1 of each Type open
    for (var o = 0; o < Object.keys(type).length; ++o)
    {
        var possible = false
        var checkAvail = type[Object.keys(type)[o]]
        // console.log(checkAvail.length)
        for (var u = 0; u < checkAvail.length; ++u)
        {
            if((checkAvail[u].Availability).match(/OPEN/i))
            {
                // one of this Type is open, check next Type
                possible = true
            }
        }
        if (!possible)
        {
            return [[]]
        }
    }

    var results = [type[Object.keys(type)[0]]]
    // console.log(results)
    for (var j = 1; j < Object.keys(type).length; ++j)
    {
        //reset list to empty
        var tempSoln = []
        for(var l = 0; l < type[Object.keys(type)[j]].length; ++l)
        {
            var listPermutes = genPermutation(results, [[type[Object.keys(type)[j]][l] ]])
            for (var p = 0; p < listPermutes.length; ++p)
            {
                // ignores permutations that are not available
                var ignore = false
                for (var y = 0; y < listPermutes[p].length; ++y)
                {
                    if (!listPermutes[p][y].Availability.match(/OPEN/i))
                    {
                        //ignore this permutation
                        ignore = true
                    }
                }
                // listPermutes[p]
                if (!ignore)
                {
                    tempSoln.push(listPermutes[p])
                }
            }

        }
        // swap out list with permutated list
        results = tempSoln
    }
    // console.log(results)
    return results
    // check and see if these permuataions intersect with schedule
}

/*
 requires atleast time, day attributes
 soln is [[lec1, dis1],[lec1, dis2]]
 add is [[elem1, elem2],[elem3, elem4]]
 returns [[lec1, dis1, elem1,elem2], [lec1, dis1, elem3,elem4] ..... ]
 */
function genPermutation(soln, add){
    // console.log(add)
    // [[course1, lec1],[course1, lec2]]
    var permutations = []
    if (soln.length == 0)
    {
        return add
    }
    if (add.length == 0)
    {
        return soln
    }
    for (var i = 0; i < soln.length; ++i)
    {
        for (var j = 0; j < add.length; ++j)
        {
            if (!timeConflict(soln[i], add[j]))
            {
                var deep = []
                for (var l = 0; l < soln[i].length; ++l)
                {
                    deep.push(soln[i][l])
                }
                for (var k = 0; k < add[j].length; ++k)
                {
                    deep.push(add[j][k])
                }
                permutations.push(deep)
                // console.log(deep)
            }
        }

    }
    // console.log(permutations)
    return permutations
}


/*
 schedule = [event1, event2...]
 schedule is a list of events known to not have conflicts
 addlist = [event, event, event]
 addlist is a list of event to check if we have a time conflict or not

 one crn might have more than 1 slot (block classes/schedules)
 */
function timeConflict(schedule, addlist){
    // console.log(schedule)
    if (schedule.length == 0)
    {
        return false
    }
    if (addlist.length == 0)
    {
        return false
    }
    for (var l = 0; l < addlist.length; ++l)
    {
        var elemDays = addlist[l].Days.split("\n")
        var elemTime = addlist[l].Time.split("\n")
        for (var i = 0; i < elemDays.length; ++i)
        {
            if (elemDays[i] != "n.a." && elemTime[i] != "ARRANGED")
            {
                for (var j = 0; j < schedule.length; ++j)
                {
                    var listDays = schedule[j].Days.split("\n")
                    var listTime = schedule[j].Time.split("\n")
                    for (var k = 0; k < listDays.length; ++k)
                    {
                        if (listDays[k] != "n.a." && listTime[k] != "ARRANGED")
                        {
                            if (isSameDays(elemDays[i], listDays[k]))
                            {
                                if (isSameTime(elemTime[i], listTime[k]))
                                {
                                    return true
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return false
}

/*
 Needs string format
 "MTWRF"
 needle, the days to check
 haystack, the days to check against
 if any of needle is in haystack, returns true
 */
function isSameDays(needleStr, haystackStr){
    var needle = needleStr.split("")
    var haystack = haystackStr.split("")
    for (var i = 0; i < needle.length; ++i)
    {
        if (haystack.indexOf(needle[i]) > -1)
        {
            return true
        }
    }
    return false
}
/*
 needs times as strings
 "02:00 PM - 03:50 PM"
 [1]:[2] [3] - [4]:[5] [6]
 /^ *(\d+):(\d+) *(AM|PM) *- *(\d+):(\d+) *(AM|PM)/i
 */
function isSameTime(needleStr, haystackStr){
    //match using regex
    var needleRegex = needleStr.match(/^ *(\d+):(\d+) *(AM|PM) *- *(\d+):(\d+) *(AM|PM)/i)
    var haystackRegex = haystackStr.match(/^ *(\d+):(\d+) *(AM|PM) *- *(\d+):(\d+) *(AM|PM)/i)
    //+12 if pm
    if (needleRegex[3].match(/PM/i))
    {
        needleRegex[1] = parseInt(needleRegex[1]) + 12
    }
    if (needleRegex[6].match(/PM/i))
    {
        needleRegex[4] = parseInt(needleRegex[4]) + 12
    }
    //make date time obj and set
    var needleStartTime = new Date()
    var needleEndTime = new Date()
    needleStartTime.setHours(needleRegex[1] , needleRegex[2], 00, 00)
    needleEndTime.setHours(needleRegex[4] , needleRegex[5], 00, 00)
    //+12 if pm
    if (haystackRegex[3].match(/PM/i))
    {
        haystackRegex[1] = parseInt(haystackRegex[1]) + 12
    }
    if (haystackRegex[6].match(/PM/i))
    {
        haystackRegex[4] = parseInt(haystackRegex[4]) + 12
    }
    //make date time obj and set
    var haystackStartTime = new Date()
    var haystackEndTime = new Date()
    haystackStartTime.setHours(haystackRegex[1] , haystackRegex[2], 00, 00)
    haystackEndTime.setHours(haystackRegex[4] , haystackRegex[5], 00, 00)

    if (haystackStartTime < needleStartTime && needleStartTime < haystackEndTime){
        return true;
    }
    else {
        return haystackStartTime < needleEndTime && needleEndTime < haystackEndTime;
    }
//    haystackStartTime < needleStartTime < needleEndTime < haystackEndTime
}