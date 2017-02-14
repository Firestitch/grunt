<?
	$dir = dirname(__DIR__)."/";
	$file = $dir."bower.json";

	$bower = json_decode(file_get_contents($file));

	foreach($bower->dependencies as $name=>$version) {

		$component_file = $dir."bower_components/".$name."/.bower.json";

		$bower_component = json_decode(file_get_contents($component_file));

		$bower->dependencies->{$name} = $bower_component->version;

		echo $name."#".$version."\n";
	}

	file_put_contents($file,json_encode($bower, JSON_PRETTY_PRINT));

	function p($value) {
		print_r($value);
	}