
// for the sake of simplicity, we're going to assume there is no noise and everything is perfect
// eventually we'd like to make each `Read` acutally an average of a few reads to reduce noise
// but for now, let's keep it simple

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
1,1,622405e2-a028-4330-9940-417164f940c0,33044075685A808000000006,2025-09-16T00:56:29.790611-04:00[America/Detroit],1,-75,[]
`

// an individual read of a tag, there should be a bunch for each tag
interface Read {
    timestamp: number; // epoch ms
    rssi: number; // signal strength
}

interface Tag {
    epc: string;
    reads: Read[];
    state: "idle" | "maybe?" | "oh yeah tha'ts going" | "already peaked" | "gone";
}


let tag_list: Tag[] = [];


function process_data(data: string) {
    let lines = data.split("\n");

    lines.reverse();

    for (let line of lines) {
        let parts = line.split(",");
        if (parts.length < 8) continue;
        let epc = parts[3];
        let rssi = parseInt(parts[6]);
        if (isNaN(rssi)) continue;
        handle_read(epc, rssi);
    }

// calculates a baseline rssi for a tag based on its reads
function calculate_baseline(reads: Read[]): number {
    // throw out the top and bottom 10% of reads
    let sorted = reads.map(r => r.rssi).sort((a, b) => a - b);
    let ten_percent = Math.floor(sorted.length / 10);
    let trimmed = sorted.slice(ten_percent, sorted.length - ten_percent);
    let sum = trimmed.reduce((a, b) => a + b, 0);
    return sum / trimmed.length;
}


// called for each read, adds to list and then figures out what's going on
function handle_read(epc: string, rssi: number) {
    let tag = tag_list.find(t => t.epc === epc);
    if (!tag) {
        tag = { epc, reads: [], state: "idle" };
        tag_list.push(tag);
    }

    tag.reads.push({ timestamp: Date.now(), rssi: rssi +80 }); // adjust rssi to be positive

    // do stuff with tag state machine
    update_tag_state(tag);
}

// guesses what the tag is actually doing based on reads
function update_tag_state(tag: Tag) {
    // idle to maybe
    // triggers if the rssi goes above 2x the baseline
    if (tag.state === "idle" && tag.reads.length > 0) {
        let baseline = calculate_baseline(tag.reads);
        let latest_read = tag.reads[tag.reads.length - 1];
        if (latest_read.rssi > 2 * baseline) {
            tag.state = "maybe?";
            console.log(`Tag ${tag.epc} state changed to maybe? at time ${new Date(latest_read.timestamp).toISOString()} with rssi ${latest_read.rssi} (baseline ${baseline.toFixed(2)})`);
        }
    }

    // maybe to oh yeah that's going
    // triggers if the reads keep going up for 3 reads in a row
    if (tag.state === "maybe?" && tag.reads.length >= 3) {
        let len = tag.reads.length;
        if (tag.reads[len - 1].rssi > tag.reads[len - 2].rssi &&
            tag.reads[len - 2].rssi > tag.reads[len - 3].rssi) {
            tag.state = "oh yeah tha'ts going";
            console.log(`Tag ${tag.epc} state changed to oh yeah tha'ts going at time ${new Date(tag.reads[len - 1].timestamp).toISOString()} with rssi ${tag.reads[len - 1].rssi} (baseline ${calculate_baseline(tag.reads).toFixed(2)})`);
        }
    }
    // maybe to idle
    // triggers if that was just a fluke and the reads jump back down without reaching a peak
    // ie, if two sequential reads are no longer above 2x the baseline
    if (tag.state === "maybe?" && tag.reads.length >= 2) {
        let baseline = calculate_baseline(tag.reads);
        let len = tag.reads.length;
        if (tag.reads[len - 1].rssi < 2 * baseline &&
            tag.reads[len - 2].rssi < 2 * baseline) {
            tag.state = "idle";
            console.log(`Tag ${tag.epc} state changed back to idle at time ${new Date(tag.reads[len - 1].timestamp).toISOString()} with rssi ${tag.reads[len - 1].rssi} (baseline ${baseline.toFixed(2)})`);
        }
    }

    // oh yeah that's going to already peaked
    // triggers if the reads start going down for 3 reads in a row
    if (tag.state === "oh yeah tha'ts going" && tag.reads.length >= 3) {
        let len = tag.reads.length;
        if (tag.reads[len - 1].rssi < tag.reads[len - 2].rssi &&
            tag.reads[len - 2].rssi < tag.reads[len - 3].rssi) {
            tag.state = "already peaked";
            console.log(`Tag ${tag.epc} state changed to already peaked at time ${new Date(tag.reads[len - 1].timestamp).toISOString()} with rssi ${tag.reads[len - 1].rssi} (baseline ${calculate_baseline(tag.reads).toFixed(2)})`);
        }
    }

    // already peaked to gone
    // triggers if the reads drop back down to baseline for 2 reads in a row
    if (tag.state === "already peaked" && tag.reads.length >= 2) {
        let baseline = calculate_baseline(tag.reads);
        let len = tag.reads.length;
        if (tag.reads[len - 1].rssi < 2 * baseline &&
            tag.reads[len - 2].rssi < 2 * baseline) {
            tag.state = "gone";
            console.log(`Tag ${tag.epc} state changed to gone at time ${new Date(tag.reads[len - 1].timestamp).toISOString()} with rssi ${tag.reads[len - 1].rssi} (baseline ${baseline.toFixed(2)})`);
            }
        }
    }
}

process_data(sample_data);