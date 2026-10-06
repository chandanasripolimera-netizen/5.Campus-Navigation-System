/*
    SMART CAMPUS NAVIGATION SYSTEM

    Algorithms:
    1. Dijkstra - Finds shortest weighted distance
    2. BFS - Finds shortest path based on number of edges
*/


// ==========================================
// CAMPUS GRAPH
// ==========================================

const graph = {

    Hostel: {
        Library: 4,
        Canteen: 6,
        Mechanical: 3,
        Parking: 5
    },

    Library: {
        Hostel: 4,
        CSE: 3,
        Admin: 5,
        Canteen: 3,
        Garden: 2
    },

    CSE: {
        Library: 3,
        Admin: 4,
        ECE: 6,
        Lab: 3,
        Civil: 5
    },

    Canteen: {
        Hostel: 6,
        Library: 3,
        Admin: 4,
        Sports: 5,
        Garden: 3
    },

    Admin: {
        Library: 5,
        CSE: 4,
        Canteen: 4,
        Auditorium: 3,
        ECE: 5,
        Civil: 3,
        Medical: 4
    },

    Sports: {
        Canteen: 5,
        Auditorium: 4,
        Medical: 3
    },

    Auditorium: {
        Sports: 4,
        Admin: 3,
        ECE: 4,
        Civil: 5
    },

    ECE: {
        CSE: 6,
        Admin: 5,
        Auditorium: 4,
        Lab: 4
    },

    Mechanical: {
        Hostel: 3,
        Library: 4,
        Civil: 5
    },

    Civil: {
        Mechanical: 5,
        CSE: 5,
        Admin: 3,
        Auditorium: 5,
        Parking: 4
    },

    Medical: {
        Admin: 4,
        Sports: 3,
        Garden: 3,
        Parking: 5
    },

    Lab: {
        CSE: 3,
        ECE: 4,
        Garden: 3
    },

    Garden: {
        Library: 2,
        Canteen: 3,
        Medical: 3,
        Lab: 3,
        Parking: 3
    },

    Parking: {
        Hostel: 5,
        Civil: 4,
        Medical: 5,
        Garden: 3
    }
};



// ==========================================
// DIJKSTRA ALGORITHM
// ==========================================

function dijkstra(start, end) {

    const distances = {};

    const previous = {};

    const visited = new Set();


    // Initialize

    for (const node in graph) {

        distances[node] = Infinity;

        previous[node] = null;
    }


    distances[start] = 0;


    // Main algorithm

    while (visited.size < Object.keys(graph).length) {

        let current = null;

        let smallestDistance = Infinity;


        // Find closest unvisited node

        for (const node in distances) {

            if (
                !visited.has(node) &&
                distances[node] < smallestDistance
            ) {

                smallestDistance = distances[node];

                current = node;
            }
        }


        if (current === null) {

            break;
        }


        visited.add(current);


        if (current === end) {

            break;
        }


        // Check neighbors

        for (const neighbor in graph[current]) {

            const newDistance =
                distances[current] +
                graph[current][neighbor];


            if (newDistance < distances[neighbor]) {

                distances[neighbor] = newDistance;

                previous[neighbor] = current;
            }
        }
    }


    return buildPath(
        previous,
        start,
        end,
        distances[end]
    );
}



// ==========================================
// BFS ALGORITHM
// ==========================================

function bfs(start, end) {

    const queue = [start];

    const visited = new Set([start]);

    const previous = {};


    for (const node in graph) {

        previous[node] = null;
    }


    while (queue.length > 0) {

        const current = queue.shift();


        if (current === end) {

            break;
        }


        for (const neighbor in graph[current]) {

            if (!visited.has(neighbor)) {

                visited.add(neighbor);

                previous[neighbor] = current;

                queue.push(neighbor);
            }
        }
    }


    const path = buildPath(
        previous,
        start,
        end
    );


    // Calculate actual distance of BFS path

    let totalDistance = 0;

    for (let i = 0; i < path.path.length - 1; i++) {

        const current = path.path[i];

        const next = path.path[i + 1];

        totalDistance += graph[current][next];
    }


    path.distance = totalDistance;

    return path;
}



// ==========================================
// BUILD PATH
// ==========================================

function buildPath(
    previous,
    start,
    end,
    distance = Infinity
) {

    const path = [];

    let current = end;


    while (current !== null) {

        path.unshift(current);

        current = previous[current];
    }


    if (path[0] !== start) {

        return {
            path: [],
            distance: Infinity
        };
    }


    return {
        path: path,
        distance: distance
    };
}



// ==========================================
// MAP COORDINATES
// ==========================================

const coordinates = {

    Hostel: [10, 15],

    Mechanical: [25, 27],

    Library: [47, 12],

    CSE: [89, 15],

    Civil: [75, 28],

    ECE: [90, 88],

    Admin: [88, 51],

    Parking: [96, 37],

    Canteen: [10, 55],

    Garden: [47, 49],

    Lab: [72, 76],

    Medical: [23, 84],

    Sports: [10, 88],

    Auditorium: [47, 89]
};



// ==========================================
// DRAW ROUTE
// ==========================================

function drawRoute(path) {

    const svg =
        document.getElementById("routeSvg");


    svg.innerHTML = "";


    if (path.length < 2) {

        return;
    }


    svg.setAttribute(
        "viewBox",
        "0 0 1000 650"
    );


    const points = path.map(node => {

        const [x, y] = coordinates[node];

        return `${x * 10},${y * 6.5}`;
    });


    const polyline =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "polyline"
        );


    polyline.setAttribute(
        "points",
        points.join(" ")
    );


    polyline.setAttribute(
        "class",
        "route-line"
    );


    svg.appendChild(polyline);
}



// ==========================================
// UPDATE BUILDING COLORS
// ==========================================

function updateLocations(start, end) {

    document
        .querySelectorAll(".location")
        .forEach(location => {

            location.classList.remove(
                "active-start",
                "active-end"
            );


            const name =
                location.dataset.name;


            if (name === start) {

                location.classList.add(
                    "active-start"
                );
            }


            if (name === end) {

                location.classList.add(
                    "active-end"
                );
            }
        });
}



// ==========================================
// DISPLAY RESULT
// ==========================================

function displayResult(
    result,
    algorithm,
    start,
    end
) {

    const resultText =
        document.getElementById(
            "resultText"
        );


    const routeDetails =
        document.getElementById(
            "routeDetails"
        );


    const distance =
        document.getElementById(
            "distance"
        );


    const locationCount =
        document.getElementById(
            "locationCount"
        );


    const algorithmUsed =
        document.getElementById(
            "algorithmUsed"
        );


    if (result.path.length === 0) {

        resultText.innerHTML =
            "❌ No route found.";

        distance.textContent = "--";

        locationCount.textContent = "--";

        algorithmUsed.textContent = "--";

        routeDetails.innerHTML = "";

        return;
    }


    // Result message

    resultText.innerHTML =

        `🎉 Route found from
        <strong>${start}</strong>
        to
        <strong>${end}</strong>
        using
        <strong>${algorithm}</strong>! 🚀`;


    // Information cards

    distance.textContent =
        result.distance + " units";


    locationCount.textContent =
        result.path.length;


    algorithmUsed.textContent =
        algorithm;


    // Route details

    routeDetails.innerHTML = "";


    result.path.forEach(
        (node, index) => {

            const nodeElement =
                document.createElement("span");


            nodeElement.className =
                "route-node";


            nodeElement.textContent =
                node;


            routeDetails.appendChild(
                nodeElement
            );


            if (
                index <
                result.path.length - 1
            ) {

                const arrow =
                    document.createElement("span");


                arrow.className =
                    "arrow";


                arrow.textContent =
                    " → ";


                routeDetails.appendChild(
                    arrow
                );
            }
        }
    );
}



// ==========================================
// FIND ROUTE
// ==========================================

document
    .getElementById("findRoute")
    .addEventListener(
        "click",
        function () {

            const start =
                document.getElementById(
                    "start"
                ).value;


            const end =
                document.getElementById(
                    "destination"
                ).value;


            const algorithm =
                document.getElementById(
                    "algorithm"
                ).value;


            if (start === end) {

                alert(
                    "⚠️ Starting point and destination cannot be the same!"
                );

                return;
            }


            let result;


            if (algorithm === "dijkstra") {

                result =
                    dijkstra(start, end);

                displayResult(
                    result,
                    "Dijkstra",
                    start,
                    end
                );

            } else {

                result =
                    bfs(start, end);

                displayResult(
                    result,
                    "BFS",
                    start,
                    end
                );
            }


            updateLocations(
                start,
                end
            );


            drawRoute(
                result.path
            );
        }
    );



// ==========================================
// RESET
// ==========================================

document
    .getElementById("reset")
    .addEventListener(
        "click",
        function () {

            document.getElementById(
                "start"
            ).value = "Hostel";


            document.getElementById(
                "destination"
            ).value = "CSE";


            document.getElementById(
                "algorithm"
            ).value = "dijkstra";


            document.getElementById(
                "routeSvg"
            ).innerHTML = "";


            document.getElementById(
                "resultText"
            ).innerHTML =
                `Select locations and click
                <strong>Find Route</strong>.`;


            document.getElementById(
                "distance"
            ).textContent = "--";


            document.getElementById(
                "locationCount"
            ).textContent = "--";


            document.getElementById(
                "algorithmUsed"
            ).textContent = "--";


            document.getElementById(
                "routeDetails"
            ).innerHTML = "";


            document
                .querySelectorAll(".location")
                .forEach(location => {

                    location.classList.remove(
                        "active-start",
                        "active-end"
                    );
                });
        }
    );