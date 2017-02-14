<?
	$dir = dirname(__DIR__)."/";
	$file = $dir."bower.json";

	$bower = json_decode(file_get_contents($file));

	$mode = isset($argv[1]) ? $argv[1] : "";

	if($mode=="latest") {

		$result = exec("cd ".$dir." && bower --json --loglevel=warn list",$output);

		if(!$result)
			die("Error: ".implode("",$output));

		$output = json_decode(implode("",$output));

		$dependencies = $output->dependencies;

		foreach($bower->dependencies as $name=>$version) {

			if(!preg_match("/^fs-angular-/",$name))
				continue;

			$dependency = @$dependencies->$name;

			if($dependency) {
				$bower->dependencies->{$name} = $dependency->update->latest;
				echo $name."#".$dependency->update->target." => ".$dependency->update->latest."\n";
			}
		}

		file_put_contents($file,json_encode($bower, JSON_PRETTY_PRINT));

	} elseif($mode=="resolve") {

		foreach($bower->dependencies as $name=>$version) {

			$component_file = $dir."bower_components/".$name."/.bower.json";

			$bower_component = json_decode(file_get_contents($component_file));

			$bower->dependencies->{$name} = $bower_component->version;

			echo $name."#".$version."\n";
		}

		file_put_contents($file,json_encode($bower, JSON_PRETTY_PRINT));

	} else
		die("Invalid mode");

	function p($value) {
		print_r($value);
	}