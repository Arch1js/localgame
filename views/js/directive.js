app.directive("navbar", function () { //navigation bar
	return {
		restrict: "A",
		templateUrl: "/../templates/navbar.ejs"
	}
});

app.directive("footer", function () { //navigation bar
	return {
		restrict: "A",
		templateUrl: "/../templates/footer.html"
	}
});

app.directive("tabs", function () { //navigation bar
	return {
		restrict: "A",
		templateUrl: "/../templates/profile_tabs.html"
	}
});

app.directive("loading", function () { //navigation bar
	return {
		restrict: "A",
		templateUrl: "/../templates/loading.html"
	}
});
