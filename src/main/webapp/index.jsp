<html>
<%@page contentType="text/html" pageEncoding="UTF-8"%>

    <head>
        <title>Lyrics</title>
        <meta charset="utf-8">
        <style>
            body {
                text-align: center;
                margin: 20px 100px;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                font-size: 1rem;
            }
        </style>
    </head>

    <body>
        <h2>Lỡ Yêu Em Rồi</h2>
        <hr>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/u45gQVMPHeM?autoplay=1" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        <hr>
        <p>Đôi môi em làm tôi bỗng như điên dại</p>
        <p>Ánh mắt quá dịu êm làm tim nhức nhối</p>
        <hr>
        <h2>Circle CI and Heroku Configuration</h2>
        <ol>
            <li>
                <h4>CircleCI (maven webapp project)</h4>
                <ul>
                    <li>
                        Push your project to git (including target folder: dont put it in .gitignore: <strong>IMPORTANT</strong>)
                    </li>
                    <li>
                        Add folder .circleci
                    </li>
                    <li>
                        Add file config.yml in this directory
                    </li>
                    <li>
                        Add configurations in this config.yml, such as jobs (build, test, deploy) and workflows. <br>
                        <p>* Notes: </p>
                        <ul>
                            <li>working_directory: ~/repo</li>
                            <li>run: mvn clean install</li>
                            <li>deploy: <em>git push https://heroku:$HEROKU_API_KEY@git.heroku.com/$HEROKU_APP.git master</em> with HEROKU_API_KEY, HEROKU_APP are defined in Heroku Project's Settings</li>
                            <li>HEROKU_APP: your heroku app's name</li>
                            <li>HEROKU_API_KEY: heroku authorizations:create</li>
                        </ul>
                    </li>
                </ul>
            </li>

            <li>
                <h4>Heroku (deploy war with webapp-runner)</h4>
                <ul>
                    <li>run command: heroku create inside project folder</li>
                    <li>add webapp-runner to pom.xml</li>
                    <li>define a Procfile with this line: <br>
                        <p><em>web: java $JAVA_OPTS -jar target/dependency/webapp-runner.jar --port $PORT target/*.war</em></p>
                    </li>
                    <li>check heroku remote with: git remote -v</li>
                    <li>When you push to heroku master -> it will deploy with remotely built war, but with circleci, you don't need to do this step</li>
                </ul>
            </li>
        </ol>
        <h4>Conclusion</h4>
        <p> After these steps, when you push normally your changes to git, circleci will take them then build, test, deploy (also push to heroku master) automatically. If you app doesn't run, check your heroku dynos with: heroku ps.</p>
    </body>

</html>