@ECHO OFF

SET git_path=.
SET src_path=%git_path%\src\web
SET build_path=%git_path%\minified
SET compiler_path=%git_path%\compiler
SET test_path=%git_path%\tests
SET deployment_path=%git_path%\bin

SET temp_min_file=%build_path%\temp_min_file
SET compiler_file=%compiler_path%\compiler.jar
SET build_file=%build_path%\util.min.js
SET license_file=%git_path%\license.txt
SET unit_test_file=%test_path%\unitTests.js

ECHO Combining javascript files
IF NOT EXIST %build_path% MKDIR %build_path%
(
    TYPE %src_path%\base.js

    TYPE %src_path%\arrays.js
    TYPE %src_path%\assert.js
    TYPE %src_path%\check.js
    TYPE %src_path%\db.js
    TYPE %src_path%\events.js
    TYPE %src_path%\location.js
    TYPE %src_path%\log.js
    TYPE %src_path%\match.js
    TYPE %src_path%\objects.js
    TYPE %src_path%\stopwatch.js

) > %temp_min_file%
ECHO Minifying temporary javascript file
java -jar %compiler_file% --js %temp_min_file% --js_output_file %build_file%
ECHO Removing temporary javascript file
DEL %build_path%\temp_min_file
ECHO Attempting to deploy code and licensing to %deployment_path%
IF EXIST %deployment_path% (
    FOR %%f IN (
        %build_file%
        %license_file%
        %unit_test_file%
    ) DO (
        xcopy %%f %deployment_path% /y > nul
    )
)
PAUSE