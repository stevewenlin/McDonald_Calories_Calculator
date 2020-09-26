// listen for submit 
// "male, female, age number, meals"
d3.select("#submitbutton").on("click", function() {
    var gender = d3.select('input[name="gender"]:checked').property("value");
    var age = d3.select("#age").property("value");
    var height = d3.select("#height").property("value");
    var weight = d3.select("#weight").property("value");
    var meals = d3.select("#meal").property("value");

    var calories = bmr(gender, age, weight, height);
    var calories_per_meal = calories / meals;


    // Import Data
    d3.json("/menu").then(function(apidata) {

        function chicken_filter(item) {
            if (item["Category"] == "Chicken & Fish") {
                return item;
            };
        }

        function beef_filter(item) {
            if (item["Category"] == "Beef & Pork") {
                return item;
            };
        }

        function breakfast_filter(item) {
            if (item["Category"] == "Breakfast") {
                return item;
            };
        }
        var chicken = apidata.filter(chicken_filter); // go find data in apidata where category is chicken
        var beef = apidata.filter(beef_filter);
        var breakfast = apidata.filter(breakfast_filter);
        var lunch_dinner = chicken.concat(beef);
        var all_meals = [];


        /////////////////////////////////////////////////////////////////
        if (meals == 3) {
            selected_breakfast = getitem(breakfast, calories_per_meal);
            all_meals.push(selected_breakfast);

            selected_lunch = getitem(chicken, calories_per_meal);
            all_meals.push(selected_lunch);

            selected_dinner = getitem(beef, calories_per_meal);
            all_meals.push(selected_dinner);


            meal_row = d3.select("#output");
            meal_row.append("div").text(selected_breakfast.Item).classed("col-md-4", true).attr("id", "first_meal");
            meal_row.append("div").text(selected_lunch.Item).classed("col-md-4", true).attr("id", "second_meal");
            meal_row.append("div").text(selected_dinner.Item).classed("col-md-4", true).attr("id", "third_meal");

            first_meal = d3.select("#first_meal")

            first_meal.append("button").text("A").on("click", function() {
                update(data1);

            })

            first_meal.append("button").text("B").on("click", function() {
                update(data2);

            })

            second_meal = d3.select("#second_meal")

            second_meal.append("button").text("A").on("click", function() {
                update(data3);

            })

            second_meal.append("button").text("B").on("click", function() {
                update(data4);

            })

            third_meal = d3.select("#third_meal")

            third_meal.append("button").text("A").on("click", function() {
                update(data5);

            })

            third_meal.append("button").text("B").on("click", function() {
                update(data6);

            })


        } else if (meals == 2) {
            selected_lunch = getitem(chicken, calories_per_meal);
            all_meals.push(selected_lunch);

            selected_dinner = getitem(beef, calories_per_meal);
            all_meals.push(selected_dinner);

            meal_row = d3.select("#output");
            meal_row.append("div").text(selected_lunch.Item).classed("col-md-4", true).attr("id", "second_meal");
            meal_row.append("div").text(selected_dinner.Item).classed("col-md-4", true).attr("id", "third_meal");

            fourth_meal = d3.select("#second_meal")

            fourth_meal.append("button").text("A").on("click", function() {
                update(data3);

            })

            fourth_meal.append("button").text("B").on("click", function() {
                update(data4);

            })

            third_meal = d3.select("#third_meal")

            third_meal.append("button").text("A").on("click", function() {
                update(data5);

            })

            third_meal.append("button").text("B").on("click", function() {
                update(data6);

            })


        } else if (meals == 1) {
            selected_lunch = getitem(lunch_dinner, calories_per_meal);
            all_meals.push(selected_lunch);

            meal_row = d3.select("#output");
            meal_row.append("div").text(selected_lunch.Item).classed("col-md-4", true).attr("id", "third_meal");

            third_meal = d3.select("#third_meal")

            third_meal.append("button").text("A").on("click", function() {
                update(data5);

            })

            third_meal.append("button").text("B").on("click", function() {
                update(data6);

            })

        };
        // set the dimensions and margins of the graph
        var width = 550
        height = 550
        margin = 40

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        var data1 = { a: selected_breakfast.Calories, b: calories_per_meal - selected_breakfast.Calories };
        var data2 = { a: selected_breakfast.Fat, b: selected_breakfast.Carbohydrates, c: selected_breakfast.Protein };
        var data3 = { a: selected_lunch.Calories, b: calories_per_meal - selected_lunch.Calories };
        var data4 = { a: selected_lunch.Fat, b: selected_lunch.Carbohydrates, c: selected_lunch.Protein };
        var data5 = { a: selected_dinner.Calories, b: calories_per_meal - selected_dinner.Calories };
        var data6 = { a: selected_dinner.Fat, b: selected_dinner.Carbohydrates, c: selected_dinner.Protein };

        // set the color scale
        var color = d3.scaleOrdinal()
            .domain(["a", "b", "c", "d", "e", "f"])
            .range(d3.schemeDark2);

        // A function that create / update the plot for a given variable:
        function update(data) {

            // Compute the position of each group on the pie:
            var pie = d3.pie()
                .value(function(d) { return d.value; })
                .sort(function(a, b) { console.log(a); return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart
            var data_ready = pie(d3.entries(data))

            // map to data
            var u = svg.selectAll("path")
                .data(data_ready)
                // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
            u
                .enter()
                .append('path')
                .merge(u)
                .transition()
                .duration(1000)
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)
                )
                .attr('fill', function(d) { return (color(d.data.key)) })
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1)


            // remove the group that is not present anymore
            u
                .exit()
                .remove()





        }

    });

});

/////////////////////////////////////////////////////////////////////
function bmr(gender, age, weight, height) {

    if (gender = "male") {
        var calories = 1.375 * (66.5 + (6.3 * weight) + (12.9 * height) - (6.8 * age));
        return calories;
    } else if (gender = "female") {
        var calories = 1.375 * (655 + (4.3 * weight) + (4.7 * height) - (4.7 * age));
        return calories;
    }
}

////////////////////////////////////////////////////////////
function getitem(my_array, calories_per_meal) {
    n = 0;
    my_array.forEach(item => {
        if (item.Calories > n &&
            item.Calories < calories_per_meal) {
            n = item.Calories
            selected = item
        };

    });
    return selected
}

//////////////////////////////////////////////////////////////////////