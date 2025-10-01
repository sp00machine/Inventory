<!-- <script lang="ts">
	import { onMount } from 'svelte';

	// Sample data from thing.ts
	const sample_data = `1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:15.167209-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:15.055856-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:14.956386-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:13.461851-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:12.555089-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:12.171998-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:12.065089-04:00[America/Detroit],1,-77,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:10.335686-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:10.214184-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:10.098136-04:00[America/Detroit],1,-77,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:10.021117-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:09.300245-04:00[America/Detroit],1,-74,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:09.147095-04:00[America/Detroit],1,-74,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:08.210910-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:08.098802-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:07.523574-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:07.107573-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:07.041016-04:00[America/Detroit],1,-77,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:06.938175-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:05.589763-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:05.003070-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:04.863052-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:04.750658-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:04.665118-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:02.352542-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:02.244014-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:01.900167-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:01.782834-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:58:00.068707-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:59.956753-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:59.829831-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:59.751330-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:54.721196-04:00[America/Detroit],1,-74,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:54.571884-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:54.475061-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:54.349455-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:52.836355-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:50.009747-04:00[America/Detroit],1,-74,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:49.732426-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:49.619897-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:49.494859-04:00[America/Detroit],1,-77,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:49.415256-04:00[America/Detroit],1,-75,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:44.400480-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:44.237867-04:00[America/Detroit],1,-76,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:41.251191-04:00[America/Detroit],1,-76,[]
1,1,e0b1476d-62d2-4b15-bd18-81299ee0d9ba,E2801191A50300683EDA0BF3,2025-09-16T00:57:37.541516-04:00[America/Detroit],1,-63,[]
1,1,e0b1476d-62d2-4b15-bd18-81299ee0d9ba,E2801191A50300683EDA0BF3,2025-09-16T00:57:37.481194-04:00[America/Detroit],1,-60,[]
1,1,e0b1476d-62d2-4b15-bd18-81299ee0d9ba,E2801191A50300683EDA0BF3,2025-09-16T00:57:37.384983-04:00[America/Detroit],1,-61,[]
1,1,e0b1476d-62d2-4b15-bd18-81299ee0d9ba,E2801191A50300683EDA0BF3,2025-09-16T00:57:37.268790-04:00[America/Detroit],1,-54,[]
1,1,e0b1476d-62d2-4b15-bd18-81299ee0d9ba,E2801191A50300683EDA0BF3,2025-09-16T00:57:37.157380-04:00[America/Detroit],1,-51,[]
1,1,e0b1476d-62d2-4b15-bd18-81299ee0d9ba,E2801191A50300683EDA0BF3,2025-09-16T00:57:37.105304-04:00[America/Detroit],1,-45,[]
1,1,e0b1476d-62d2-4b15-bd18-81299ee0d9ba,E2801191A50300683EDA0BF3,2025-09-16T00:57:37.013512-04:00[America/Detroit],1,-48,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.897217-04:00[America/Detroit],1,-38,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.772612-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.661897-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.544041-04:00[America/Detroit],1,-30,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.431973-04:00[America/Detroit],1,-30,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.325012-04:00[America/Detroit],1,-32,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.218055-04:00[America/Detroit],1,-32,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.104760-04:00[America/Detroit],1,-32,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:36.041473-04:00[America/Detroit],1,-30,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.968949-04:00[America/Detroit],1,-30,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.856478-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.731698-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.619668-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.505332-04:00[America/Detroit],1,-33,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.398564-04:00[America/Detroit],1,-33,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.285550-04:00[America/Detroit],1,-30,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.174228-04:00[America/Detroit],1,-30,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:35.059783-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.996476-04:00[America/Detroit],1,-29,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.913483-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.802013-04:00[America/Detroit],1,-30,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.686968-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.579083-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.464165-04:00[America/Detroit],1,-29,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.353433-04:00[America/Detroit],1,-29,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.238970-04:00[America/Detroit],1,-30,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.165085-04:00[America/Detroit],1,-29,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:34.104893-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.996886-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.932849-04:00[America/Detroit],1,-29,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.859956-04:00[America/Detroit],1,-31,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.751108-04:00[America/Detroit],1,-33,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.634345-04:00[America/Detroit],1,-33,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.522437-04:00[America/Detroit],1,-36,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.409964-04:00[America/Detroit],1,-40,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.320183-04:00[America/Detroit],1,-44,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.278184-04:00[America/Detroit],1,-47,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.164310-04:00[America/Detroit],1,-53,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.114802-04:00[America/Detroit],1,-57,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:33.031115-04:00[America/Detroit],1,-62,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:32.919545-04:00[America/Detroit],1,-60,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:32.813818-04:00[America/Detroit],1,-70,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:32.703096-04:00[America/Detroit],1,-71,[]
1,1,d999d405-3165-46a4-8f8b-65b64c3f7210,E2801191A50300683EDA0BF3,2025-09-16T00:57:32.607627-04:00[America/Detroit],1,-75,[]
1,1,2221a3e5-cb0b-47b8-80cf-035379388f2b,E2801191A50300683EDA0BF3,2025-09-16T00:57:32.439682-04:00[America/Detroit],1,-66,[]
1,1,2221a3e5-cb0b-47b8-80cf-035379388f2b,E2801191A50300683EDA0BF3,2025-09-16T00:57:32.330625-04:00[America/Detroit],1,-74,[]
1,1,aa3ab22e-9310-48e2-b825-c7b107590c1a,33044075685A808000000006,2025-09-16T00:57:32.227927-04:00[America/Detroit],1,-76,[]
1,1,2221a3e5-cb0b-47b8-80cf-035379388f2b,E2801191A50300683EDA0BF3,2025-09-16T00:57:32.211156-04:00[America/Detroit],1,-73,[]
1,1,2221a3e5-cb0b-47b8-80cf-035379388f2b,E2801191A50300683EDA0BF3,2025-09-16T00:57:32.092436-04:00[America/Detroit],1,-72,[]
1,1,54b88981-531c-4d60-9b08-c6cd6e76dad2,33044075685A808000000006,2025-09-16T00:57:29.346440-04:00[America/Detroit],1,-74,[]
1,1,54b88981-531c-4d60-9b08-c6cd6e76dad2,33044075685A808000000006,2025-09-16T00:57:29.219647-04:00[America/Detroit],1,-75,[]
1,1,54b88981-531c-4d60-9b08-c6cd6e76dad2,33044075685A808000000006,2025-09-16T00:57:29.094925-04:00[America/Detroit],1,-74,[]
1,1,54b88981-531c-4d60-9b08-c6cd6e76dad2,33044075685A808000000006,2025-09-16T00:57:28.976145-04:00[America/Detroit],1,-74,[]
1,1,54b88981-531c-4d60-9b08-c6cd6e76dad2,33044075685A808000000006,2025-09-16T00:57:28.909141-04:00[America/Detroit],1,-76,[]
1,1,dbff59e3-0b47-448b-9fa9-91dbd4a8ed9e,33044075685A808000000006,2025-09-16T00:57:28.794879-04:00[America/Detroit],1,-75,[]
1,1,dbff59e3-0b47-448b-9fa9-91dbd4a8ed9e,33044075685A808000000006,2025-09-16T00:57:28.000770-04:00[America/Detroit],1,-76,[]
1,1,e9fc50d9-0672-4978-9427-1c590e08b303,33044075685A808000000006,2025-09-16T00:57:13.373582-04:00[America/Detroit],1,-75,[]
1,1,e9fc50d9-0672-4978-9427-1c590e08b303,33044075685A808000000006,2025-09-16T00:57:11.631498-04:00[America/Detroit],1,-76,[]
1,1,2e5a6e81-4b43-4c82-9202-3ad138faa402,33044075685A808000000006,2025-09-16T00:57:08.436127-04:00[America/Detroit],1,-74,[]
1,1,2e5a6e81-4b43-4c82-9202-3ad138faa402,33044075685A808000000006,2025-09-16T00:57:08.403155-04:00[America/Detroit],1,-75,[]
1,1,2e5a6e81-4b43-4c82-9202-3ad138faa402,33044075685A808000000006,2025-09-16T00:57:05.304429-04:00[America/Detroit],1,-76,[]
1,1,2e5a6e81-4b43-4c82-9202-3ad138faa402,33044075685A808000000006,2025-09-16T00:57:03.236141-04:00[America/Detroit],1,-76,[]
1,1,e55545f1-9149-475d-acae-7b8be549e416,33044075685A808000000006,2025-09-16T00:56:52.832445-04:00[America/Detroit],1,-75,[]
1,1,e55545f1-9149-475d-acae-7b8be549e416,33044075685A808000000006,2025-09-16T00:56:51.072951-04:00[America/Detroit],1,-76,[]
1,1,e55545f1-9149-475d-acae-7b8be549e416,33044075685A808000000006,2025-09-16T00:56:50.260419-04:00[America/Detroit],1,-76,[]
1,1,e55545f1-9149-475d-acae-7b8be549e416,33044075685A808000000006,2025-09-16T00:56:49.909486-04:00[America/Detroit],1,-76,[]
1,1,e55545f1-9149-475d-acae-7b8be549e416,33044075685A808000000006,2025-09-16T00:56:47.925905-04:00[America/Detroit],1,-76,[]
1,1,e55545f1-9149-475d-acae-7b8be549e416,33044075685A808000000006,2025-09-16T00:56:47.807124-04:00[America/Detroit],1,-76,[]
1,1,5e977be3-0e7e-421b-87e7-ca44a7fb8c74,33044075685A808000000006,2025-09-16T00:56:42.721453-04:00[America/Detroit],1,-75,[]
1,1,5e977be3-0e7e-421b-87e7-ca44a7fb8c74,33044075685A808000000006,2025-09-16T00:56:40.889554-04:00[America/Detroit],1,-77,[]
1,1,5e977be3-0e7e-421b-87e7-ca44a7fb8c74,33044075685A808000000006,2025-09-16T00:56:39.519641-04:00[America/Detroit],1,-76,[]
1,1,622405e2-a028-4330-9940-417164f940c0,33044075685A808000000006,2025-09-16T00:56:32.340421-04:00[America/Detroit],1,-75,[]
1,1,622405e2-a028-4330-9940-417164f940c0,33044075685A808000000006,2025-09-16T00:56:30.605069-04:00[America/Detroit],1,-75,[]
1,1,622405e2-a028-4330-9940-417164f940c0,33044075685A808000000006,2025-09-16T00:56:29.790611-04:00[America/Detroit],1,-75,[]`
;

	interface DataPoint {
		timestamp: Date;
		rssi: number;
		epc: string;
		reader_id: string;
	}

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;
	let parsed_data: DataPoint[] = [];
	let tag_colors: Map<string, string> = new Map();
	let width = 1200;
	let height = 600;
	let padding = 60;

	function parseData() {
		const lines = sample_data.trim().split('\n');
		const color_palette = [
			'#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', 
			'#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894'
		];
		let color_index = 0;

		parsed_data = lines.map(line => {
			const parts = line.split(',');
			if (parts.length < 7) return null;
			
			const epc = parts[3];
			const reader_id = parts[2];
			const timestamp_string = parts[4].split('[')[0]; // Remove timezone name in brackets
			const timestamp = new Date(timestamp_string);
			const rssi = parseInt(parts[6]);

			if (!tag_colors.has(epc)) {
				tag_colors.set(epc, color_palette[color_index % color_palette.length]);
				color_index++;
			}

			return { timestamp, rssi, epc, reader_id };
		}).filter(d => d !== null) as DataPoint[];

		parsed_data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
	}

	function drawGraph() {
		if (!ctx || parsed_data.length === 0) return;

		ctx.clearRect(0, 0, width, height);

		const min_timestamp = Math.min(...parsed_data.map(d => d.timestamp.getTime()));
		const max_timestamp = Math.max(...parsed_data.map(d => d.timestamp.getTime()));
		const min_rssi = Math.min(...parsed_data.map(d => d.rssi));
		const max_rssi = Math.max(...parsed_data.map(d => d.rssi));

		const x_scale = (width - 2 * padding) / (max_timestamp - min_timestamp);
		const y_scale = (height - 2 * padding) / (max_rssi - min_rssi);

		function getX(timestamp: number): number {
			return padding + (timestamp - min_timestamp) * x_scale;
		}

		function getY(rssi: number): number {
			return height - padding - (rssi - min_rssi) * y_scale;
		}

		ctx.strokeStyle = '#e0e0e0';
		ctx.lineWidth = 1;

		for (let i = 0; i <= 10; i++) {
			const y = padding + (i / 10) * (height - 2 * padding);
			ctx.beginPath();
			ctx.moveTo(padding, y);
			ctx.lineTo(width - padding, y);
			ctx.stroke();

			const rssi_value = max_rssi - (i / 10) * (max_rssi - min_rssi);
			ctx.fillStyle = '#666';
			ctx.font = '12px sans-serif';
			ctx.textAlign = 'right';
			ctx.fillText(rssi_value.toFixed(0) + ' dBm', padding - 10, y + 4);
		}

		for (let i = 0; i <= 5; i++) {
			const x = padding + (i / 5) * (width - 2 * padding);
			ctx.beginPath();
			ctx.moveTo(x, padding);
			ctx.lineTo(x, height - padding);
			ctx.stroke();

			const time_value = new Date(min_timestamp + (i / 5) * (max_timestamp - min_timestamp));
			ctx.fillStyle = '#666';
			ctx.font = '12px sans-serif';
			ctx.textAlign = 'center';
			const time_str = time_value.toLocaleTimeString('en-US', { 
				hour12: false, 
				hour: '2-digit', 
				minute: '2-digit', 
				second: '2-digit' 
			});
			ctx.fillText(time_str, x, height - padding + 20);
		}

		const tags_data = new Map<string, DataPoint[]>();
		parsed_data.forEach(d => {
			if (!tags_data.has(d.epc)) {
				tags_data.set(d.epc, []);
			}
			tags_data.get(d.epc)!.push(d);
		});

		tags_data.forEach((tag_points, epc) => {
			const color = tag_colors.get(epc) || '#666';
			ctx.strokeStyle = color;
			ctx.fillStyle = color;
			ctx.lineWidth = 2;

			if (tag_points.length > 1) {
				ctx.beginPath();
				ctx.moveTo(getX(tag_points[0].timestamp.getTime()), getY(tag_points[0].rssi));
				
				for (let i = 1; i < tag_points.length; i++) {
					ctx.lineTo(getX(tag_points[i].timestamp.getTime()), getY(tag_points[i].rssi));
				}
				ctx.stroke();
			}

			tag_points.forEach(point => {
				ctx.beginPath();
				ctx.arc(getX(point.timestamp.getTime()), getY(point.rssi), 3, 0, 2 * Math.PI);
				ctx.fill();
			});
		});

		ctx.fillStyle = '#333';
		ctx.font = 'bold 16px sans-serif';
		ctx.textAlign = 'center';
		ctx.fillText('RFID Signal Strength Over Time', width / 2, 30);
		
		ctx.font = '14px sans-serif';
		ctx.fillText('Time', width / 2, height - 10);
		
		ctx.save();
		ctx.translate(20, height / 2);
		ctx.rotate(-Math.PI / 2);
		ctx.fillText('Signal Strength (dBm)', 0, 0);
		ctx.restore();
	}

	function drawLegend() {
		const legend_x = width - 200;
		const legend_y = 60;
		let y_offset = 0;

		ctx.fillStyle = '#f9f9f9';
		ctx.strokeStyle = '#ddd';
		ctx.lineWidth = 1;
		ctx.fillRect(legend_x - 10, legend_y - 10, 190, tag_colors.size * 25 + 20);
		ctx.strokeRect(legend_x - 10, legend_y - 10, 190, tag_colors.size * 25 + 20);

		ctx.fillStyle = '#333';
		ctx.font = 'bold 12px sans-serif';
		ctx.textAlign = 'left';
		ctx.fillText('RFID Tags', legend_x, legend_y);

		tag_colors.forEach((color, epc) => {
			y_offset += 20;
			
			ctx.fillStyle = color;
			ctx.fillRect(legend_x, legend_y + y_offset - 8, 15, 10);
			
			ctx.fillStyle = '#333';
			ctx.font = '10px monospace';
			const short_epc = epc.substring(0, 8) + '...';
			ctx.fillText(short_epc, legend_x + 20, legend_y + y_offset);
		});
	}

	onMount(() => {
		ctx = canvas.getContext('2d')!;
		parseData();
		drawGraph();
		drawLegend();
	});
</script>

<div class="border border-gray-300 rounded-lg p-5 bg-white shadow-sm my-5">
	<canvas bind:this={canvas} {width} {height} class="block mx-auto"></canvas>
</div> -->