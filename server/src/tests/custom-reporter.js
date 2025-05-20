const chalk = require('chalk');

class CustomReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
    this.startTime = null;
    this.passedTests = 0;
    this.failedTests = 0;
    this.totalTests = 0;
    this.testResults = [];
    this.failedTestDetails = [];
  }

  onRunStart(results, options) {
    this.startTime = new Date();
    console.log('\n');
    console.log(chalk.cyan.bold('╔═════════════════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║                                                                                 ║'));
    console.log(chalk.cyan.bold('║  ') + chalk.yellow.bold('                        БЕЛКА DANCE - ТЕСТЫ СЕРВЕРА                      ') + chalk.cyan.bold('  ║'));
    console.log(chalk.cyan.bold('║                                                                                 ║'));
    console.log(chalk.cyan.bold('╚═════════════════════════════════════════════════════════════════════════════════╝'));
    console.log('\n');
  }

  onTestResult(test, testResult, aggregatedResult) {
    const { numPassingTests, numFailingTests, testResults } = testResult;
    
    this.passedTests += numPassingTests;
    this.failedTests += numFailingTests;
    this.totalTests += testResults.length;
    
    const testFile = test.path.split('/tests/')[1] || test.path;
    
    
    const fileResult = {
      file: testFile,
      passed: numPassingTests,
      failed: numFailingTests,
      total: testResults.length,
      tests: []
    };

    
    testResults.forEach((test) => {
      const testInfo = {
        name: test.title,
        status: test.status,
        duration: test.duration
      };
      
      fileResult.tests.push(testInfo);
      
      
      if (test.status === 'failed') {
        this.failedTestDetails.push({
          file: testFile,
          testName: test.title,
          errorMessage: test.failureMessages[0]
        });
      }
    });
    
    this.testResults.push(fileResult);
  }

  
  createProgressBar(percent, length = 30) {
    const filled = Math.round(percent * length / 100);
    const empty = length - filled;
    
    const filledBar = filled > 0 ? chalk.green('█'.repeat(filled)) : '';
    const emptyBar = empty > 0 ? chalk.gray('░'.repeat(empty)) : '';
    
    return `${filledBar}${emptyBar} ${percent.toFixed(0)}%`;
  }

  onRunComplete(contexts, results) {
    const endTime = new Date();
    const executionTime = ((endTime - this.startTime) / 1000).toFixed(2);
    const testSuites = results.numPassedTestSuites + results.numFailedTestSuites;
    
    
    const passPercent = results.numTotalTests > 0 ? (results.numPassedTests / results.numTotalTests) * 100 : 0;
    
    
    this.testResults.sort((a, b) => {
    
      if (a.failed > 0 && b.failed === 0) return -1;
      if (a.failed === 0 && b.failed > 0) return 1;
      
     
      return a.file.localeCompare(b.file);
    });
    
    console.log(chalk.cyan.bold('╔═════════════════════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║                                                                                 ║'));
    console.log(chalk.cyan.bold('║  ') + chalk.yellow.bold('                           СВОДКА ТЕСТИРОВАНИЯ                          ') + chalk.cyan.bold('  ║'));
    console.log(chalk.cyan.bold('║                                                                                 ║'));
    
    
    const progressBar = this.createProgressBar(passPercent);
    console.log(chalk.cyan.bold('║  ') + chalk.white.bold('Прогресс: ') + progressBar + chalk.cyan.bold('                                      ║'));
    
    console.log(chalk.cyan.bold('║                                                                                 ║'));
    console.log(chalk.cyan.bold('╠═════════════════════════════════════════════════════════════════════════════════╣'));
    
    
    console.log(chalk.cyan.bold('║  ') + chalk.white.bold('Файл теста                                   Прошло  Упало   Всего    ') + chalk.cyan.bold('  ║'));
    console.log(chalk.cyan.bold('╠═════════════════════════════════════════════════════════════════════════════════╣'));
    
    
    this.testResults.forEach(result => {
      const fileName = result.file.padEnd(40);
      const passed = result.passed.toString().padStart(4);
      const failed = result.failed.toString().padStart(6);
      const total = result.total.toString().padStart(7);
      
      
      const filePassPercent = result.total > 0 ? (result.passed / result.total) * 100 : 0;
      const percentStr = filePassPercent === 100 ? chalk.green(`100%`) : chalk.yellow(`${filePassPercent.toFixed(0)}%`);
      
      console.log(
        chalk.cyan.bold('║  ') + 
        chalk.white(fileName) + '  ' + 
        (result.failed > 0 ? chalk.red(passed) : chalk.green(passed)) + '  ' + 
        (result.failed > 0 ? chalk.red(failed) : chalk.green(failed)) + '  ' + 
        chalk.white(total) + ' ' + 
        percentStr.padStart(7) + 
        chalk.cyan.bold('  ║')
      );
    });
    
    
  
    console.log(chalk.cyan.bold('╠═════════════════════════════════════════════════════════════════════════════════╣'));
    console.log(chalk.cyan.bold('║  ') + chalk.white.bold('                           ДЕТАЛИ ТЕСТОВ                              ') + chalk.cyan.bold('  ║'));
    console.log(chalk.cyan.bold('╠═════════════════════════════════════════════════════════════════════════════════╣'));
    
    this.testResults.forEach(fileResult => {
      console.log(chalk.cyan.bold('║  ') + chalk.white.bold(`Файл: ${fileResult.file}`) + chalk.cyan.bold('                                                        ║').substring(`Файл: ${fileResult.file}`.length + 4));
      
      
      fileResult.tests.sort((a, b) => {
        if (a.status === 'failed' && b.status !== 'failed') return -1;
        if (a.status !== 'failed' && b.status === 'failed') return 1;
        return 0;
      });
      
      fileResult.tests.forEach((test, index) => {
        const statusIcon = test.status === 'passed' 
          ? chalk.green('✓') 
          : chalk.red('✗');
        
        const testName = test.name.length > 60 
          ? test.name.substring(0, 57) + '...' 
          : test.name;
        
        const duration = `${test.duration}ms`.padStart(6);
        
        const paddedTestLine = `  ${statusIcon} ${testName}`.padEnd(70);
        
        console.log(
          chalk.cyan.bold('║  ') + 
          paddedTestLine +
          chalk.gray(duration) + 
          chalk.cyan.bold('  ║')
        );
      });
      
      console.log(chalk.cyan.bold('║                                                                                 ║'));
    });
    
    
    if (this.failedTestDetails.length > 0) {
      console.log(chalk.cyan.bold('╠═════════════════════════════════════════════════════════════════════════════════╣'));
      console.log(chalk.cyan.bold('║  ') + chalk.red.bold('                            ОШИБКИ ТЕСТОВ                              ') + chalk.cyan.bold('  ║'));
      console.log(chalk.cyan.bold('╠═════════════════════════════════════════════════════════════════════════════════╣'));
      
      this.failedTestDetails.forEach((failure, index) => {
        console.log(chalk.cyan.bold('║  ') + chalk.red.bold(`Тест: ${failure.file} - ${failure.testName}`) + chalk.cyan.bold('                            ║').substring(`Тест: ${failure.file} - ${failure.testName}`.length + 4));
        
        const errorLines = failure.errorMessage.split('\n');
        const mainError = errorLines[0].trim();
        console.log(chalk.cyan.bold('║  ') + chalk.red(`Ошибка: ${mainError}`) + chalk.cyan.bold('                                                 ║').substring(`Ошибка: ${mainError}`.length + 4));
        console.log(chalk.cyan.bold('║                                                                                 ║'));
      });
    }
    
    
    console.log(chalk.cyan.bold('╠═════════════════════════════════════════════════════════════════════════════════╣'));
    console.log(chalk.cyan.bold('║                                                                                 ║'));
    console.log(
      chalk.cyan.bold('║  ') + 
      chalk.white.bold('ТЕСТОВЫЕ НАБОРЫ: ') + 
      chalk.green.bold(`${results.numPassedTestSuites} пройдено`) + 
      chalk.white.bold(', ') + 
      chalk.red.bold(`${results.numFailedTestSuites} упало`) + 
      chalk.white.bold(', ') + 
      chalk.white.bold(`${testSuites} всего`) + 
      chalk.cyan.bold('                      ║')
    );
    
    console.log(
      chalk.cyan.bold('║  ') + 
      chalk.white.bold('ТЕСТЫ: ') + 
      chalk.green.bold(`${results.numPassedTests} пройдено`) + 
      chalk.white.bold(', ') + 
      chalk.red.bold(`${results.numFailedTests} упало`) + 
      chalk.white.bold(', ') + 
      chalk.white.bold(`${results.numTotalTests} всего`) + 
      chalk.white.bold(` (${passPercent.toFixed(0)}%)`) + 
      chalk.cyan.bold('                      ║')
    );
    
    console.log(
      chalk.cyan.bold('║  ') + 
      chalk.white.bold(`ВРЕМЯ: ${executionTime} секунд`) + 
      chalk.cyan.bold('                                                           ║')
    );
    
    console.log(chalk.cyan.bold('║                                                                                 ║'));
    console.log(chalk.cyan.bold('╚═════════════════════════════════════════════════════════════════════════════════╝'));
    console.log('\n');
  }
}

module.exports = CustomReporter; 