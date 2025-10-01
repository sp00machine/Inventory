<script lang="ts">
	import RfidDataGraph from '$lib/components/RfidDataGraph.svelte';
</script>

<svelte:head>
	<title>RFID Signal Strength Graph</title>
</svelte:head>

<div class="max-w-7xl mx-auto p-5 font-sans">
	<h1 class="text-gray-800 text-center mb-2.5 text-3xl font-bold">RFID Signal Strength Visualization</h1>
	<p class="text-center text-gray-600 mb-7 leading-relaxed">
		This graph displays RFID tag signal strength (RSSI) readings over time from the sample data.
		Each colored line represents a different RFID tag, showing how signal strength changes as tags move closer or farther from the reader.
	</p>
	
	<RfidDataGraph />
	
	<div class="mt-7 p-5 bg-gray-50 rounded-lg border-l-4 border-blue-500">
		<h2 class="mt-0 text-gray-800 text-xl font-semibold mb-4">Understanding the Data</h2>
		<ul class="leading-relaxed text-gray-700 space-y-2">
			<li><strong class="text-gray-800">Y-axis:</strong> Signal strength in dBm (higher values = stronger signal)</li>
			<li><strong class="text-gray-800">X-axis:</strong> Time progression showing when readings were taken</li>
			<li><strong class="text-gray-800">Different colors:</strong> Each RFID tag has its own color</li>
			<li><strong class="text-gray-800">Signal patterns:</strong> Rising signal typically means tag approaching, falling means moving away</li>
		</ul>
	</div>
</div>