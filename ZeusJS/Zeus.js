const axios = require('axios');

const LIST_JSON_PATH = "../list.json"
const MAX_RESULT = 2
const MAX_RESPONSES_PER_LINK = 3

class Bcolors{

    constructor(){

        this.HEADER = "\x1b[35m";
        this.OKBLUE = "\x1b[34m";
        this.OKGREEN = "\x1b[32m";
        this.WARNING = "\x1b[33m";
        this.FAIL = "\x1b[31m";
        this.ENDC = "\x1b[37m";
        this.BOLD = "\x1b[36m";
        this.BLACK = "\x1b[30m";
        this.UNDERLINE = '';
    }
}

let bcolors = new Bcolors();

// console.log bcolors.WARNING + "Warning: No active frommets remain. Continue?" 
//       + bcolors.ENDC

class Zeus{
    constructor(search_level = 0){
        /**
            Keyword Arguments:
                specific_link {list} -- [list of specific link, where to find] (functionault: {[]})
                search_level {int} -- [The level of searching results going from 0 to 5] (functionault: {0})
        */
        this._type = "Javascript"
        this.search_level = search_level
        this.checking_message = "\r[+] Checking available solution(s) online, search_level("+(this.search_level).toString()+")."
    };

    /**
     * The presentation method
     * @return
     */
    presentation(){
        /**
        A simple function for the header of Zeus
        **/
        console.log(bcolors.OKGREEN + "[+] ---------------------------------------------------------------------"+ bcolors.ENDC)
        console.log(bcolors.OKGREEN + "[+] |__  /___ _   _ ___  "+ bcolors.ENDC)
        console.log(bcolors.OKGREEN + "[+]   / // _ \\ | | / __| ["+this._type+"] version."+ bcolors.ENDC)
        console.log(bcolors.OKGREEN + "[+]  / /|  __/ |_| \\__ \\ This tool find your exception online for you."+ bcolors.ENDC)
        console.log(bcolors.OKGREEN + "[+] /____\\___|\\__,_|___/ Made by S@n1x-d4rk3r (github.com/sanix-darker)"+ bcolors.ENDC)
        console.log(bcolors.OKGREEN + "[+] ---------------------------------------------------------------------"+ bcolors.ENDC)
    }

    get_input(message){
        // Get process.stdin as the standard input object.
        const standard_input = process.stdin;
        // Set input character encoding.
        standard_input.setEncoding('utf-8');
        return new Promise((resolve, reject) => {
            console.log(message)
            // When user input data and click enter key.
            standard_input.on('data', (data) => {
                // Print user input in console.
                resolve(data.replace("\n", ""))
                //process.exit();
            });
        });
    }

    /**
     *
     * A function that return the result of solutions around the web
     *
     *  Keyword Arguments:
     *      solutions {list} -- [The list of solutions fetched] (default: {""})
     * @return
     */
    printResult(solutions){

        console.log("\n\n[+] -----------------")

        solutions.forEach((item, index) => {
            console.log(bcolors.BOLD + "[+] "+(index+1).toString()+"-) "+item["title"]+" ("+(item["all_count"]).toString()+" / "+(item["result_count"]).toString()+")" + bcolors.ENDC)
        });
        console.log(bcolors.FAIL + "[+] 0-) To stop" + bcolors.ENDC)
        console.log("[+] ------------------------")

        const checkPoint_1 = () => {
            let choice = 0
            const get_input = this.get_input(bcolors.WARNING + "[+] Choose available options: " + bcolors.ENDC);
            get_input.then((input) => {
                choice = parseInt(input);
                if(choice === 0){ process.exit(); }
            }).catch((error) => { console.error(error); })
            .finally(() => {

                try{
                    const checkPoint_2 = () => {
                        const selected = solutions[choice-1]
                        console.log("\n\n[+] -----------------")
                        console.log(bcolors.HEADER + "[+] On "+selected["title"]+"\n" + bcolors.ENDC)

                        selected["result_list"].forEach((item, index) => {
                            console.log(bcolors.BOLD + "[+] "+(index+1).toString()+"-) "+(item["title"]).toString()+" ("+(item["answers"]).toString()+" answers, "+(item["votes"]).toString()+" votes)" + bcolors.ENDC)
                        });

                        console.log(bcolors.FAIL + "[+] 0-) To Back" + bcolors.ENDC)
                        console.log("[+] ------------------------")

                        let choice2 = 0
                        const get_input2 = this.get_input(bcolors.WARNING + "[+] Choose available options: " + bcolors.ENDC);
                        get_input2.then((input) => {
                            choice2 = parseInt(input);
                        }).catch((error) => { console.error(error); })
                        .finally(() => {
                            try{
                                if(choice2 == 0){
                                    this.printResult(solutions);
                                }else{
                                    if(typeof (selected["result_list"][choice2-1]) !== "undefined"){
                                        console.log("\n\n[+] -----------------")
                                        console.log(bcolors.HEADER + "[+] On "+selected["title"] + bcolors.ENDC)
                                        console.log("[+] > Title : '"+selected["result_list"][choice2-1]["title"]+"'")
                                        console.log("[+] > Link : '"+selected["result_list"][choice2-1]["link"]+"'")

                                        if (selected["result_list"][choice2-1]["solve_response"].length > 4){
                                            console.log(bcolors.OKGREEN + "[+] > Solution : ")
                                            console.log("[+] ===================================================================================================")
                                            console.log("[+] ---------------------------------------------------------------------------------------------------")
                                            console.log((selected["result_list"][choice2-1]["solve_response"]).replace("\n", "\n[+] \t"))
                                            console.log("[+] ---------------------------------------------------------------------------------------------------")
                                            console.log("[+] ===================================================================================================" + bcolors.ENDC)
                                        }else{
                                            console.log(bcolors.FAIL + "[+] { Any Solution was approve for this question }" + bcolors.ENDC)
                                        }

                                        const entireQuestionOrStop = () => {
                                            let entire_content = ""
                                            const get_input5 = this.get_input(bcolors.WARNING + "[+] Do you want to see the entire question ? (Y/N) :" + bcolors.ENDC);
                                            get_input5.then((input) => {
                                                entire_content = (input).toString().toLowerCase();
                                            }).catch((error) => { console.error(error); })
                                            .finally(() => {
                                                try{
                                                    if (entire_content == "y"){
                                                        console.log("[+] > Content :")
                                                        console.log("[+] --------------------------|||||||||||||||||||||||||--------------------------|||||||||||||||||||||||||")
                                                        console.log("[+] --------------------------|||||||||||||||||||||||||--------------------------|||||||||||||||||||||||||")
                                                        console.log((selected["result_list"][choice2-1]["content"]).replace("\n", "\n[+] \t"))
                                                        console.log("[+] --------------------------|||||||||||||||||||||||||--------------------------|||||||||||||||||||||||||")
                                                    }
                                                }catch(err){console.log(err)}

                                                console.log(bcolors.FAIL + "[+] 0-) To Back" + bcolors.ENDC)
                                                console.log(bcolors.FAIL + "[+] 99-) To Exit" + bcolors.ENDC)
                                                console.log("[+] ------------------------")
                                                const get_input6 = this.get_input(bcolors.WARNING + "[+] Choose available options: " + bcolors.ENDC);
                                                get_input6.then((input) => {
                                                    choice2 = parseInt(input);
                                                    if(choice2 == 0){ checkPoint_2() }
                                                    if(choice2 == 99){ process.exit(); }
                                                });
                                            });
                                        }

                                        //We check first if the numper of all others responses
                                        if (selected["result_list"][choice2-1]["responses"].length > 0){
                                            let getall = ""
                                            const get_input4 = this.get_input(bcolors.WARNING + "[+] Do you want to get all responses ? (Y/N) :" + bcolors.ENDC);
                                            get_input4.then((input) => {
                                                getall = (input).toString().toLowerCase();
                                            }).catch((error) => { console.error(error); })
                                            .finally(() => {
                                                try{
                                                    if (getall == "y"){
                                                        console.log("[+] > Others responses :")
                                                        console.log("\n[+] -")
                                                        selected["result_list"][choice2-1]["responses"].forEach((item, index) => {
                                                            console.log("[+] ```````````````````````````````````````````````````````````````````````````````````````")
                                                            console.log(bcolors.BOLD + "[+] "+(index).toString()+"-) "+(item["votes"]).toString()+"Votes" + bcolors.ENDC)
                                                            console.log("[+] ```````````````````````````````````````````````````````````````````````````````````````")
                                                            console.log("[+] "+item["content"].replace("\n", "\n[+] \t"))
                                                        });
                                                        console.log("[+] -\n")
                                                    }
                                                }catch(err){console.log(err)}
                                                entireQuestionOrStop();
                                            });
                                        }else{
                                            entireQuestionOrStop();
                                        }
                                    }
                                }
                            }catch(err){console.log(err)}
                        });
                    }
                    checkPoint_2();
                }catch(err){console.log(err)}
            });
        }
        checkPoint_1();
    }


    // This method will only print the waiting message
    // process.stdout.write(this.checking_message+"\r");
    checking_message_method(){
        this.checking_message += "."
        return this.checking_message
    }

    buildResultList(elt, link, tree, JSONObj, i):
    /**
    * [This method have the role on building the result_list]

        Arguments:
            elt {[type]} -- [element from the array of titles]
            link {[str]} -- [The link]
            content {[str]} -- [The content of the question]
            tree {[xpath]} -- [description]
            tree2 {[xpath]} -- [description]
            JSONObj {[json]} -- [description]
    */
        const content = ""
        try{
            ''.join(tree.xpath(JSONObj['each']['content']))
        }catch(err){

        }

        if("://" not in link){
            link = JSONObj['link'] + link
        }

        const source = requests.get(link)
        // The tree2 for sub-requests
        tree2 = html.fromstring(source.content)

        to_append =  {
            "title": elt,
            "link": link,
            "content":content
        }
        # Getting the solution
        to_append["solve_response"] = ""
        try: to_append["solve_response"] = ''.join(tree2.xpath(JSONObj['solve_response'])[0].xpath('.//text()'))
        except Exception as es: pass

        # Getting the number of answers
        to_append["answers"] = 0
        try: to_append["answers"] = int(tree.xpath(JSONObj['each']['answers'])[i])
        except Exception as es: pass

        # Getting the number of votes
        to_append["votes"] = 0
        try: to_append["votes"] = int(tree.xpath(JSONObj['each']['votes'])[i])
        except Exception as es: pass

        # Getting the list of all response
        responses_content = []
        responses_count = 0
        for rep in tree2.xpath(JSONObj['responses']):
            # On recuperes uniquement des elements qui ne sont pas de la reponse
            if ''.join(rep.xpath('.//text()')) != to_append["solve_response"] :
                votes_per_response = 0
                try: votes_per_response = int(tree2.xpath(JSONObj['responses_vote'])[responses_count])
                except Exception as es: pass
                responses_content.append( { "votes": votes_per_response, "content":''.join(rep.xpath('.//text()'))})
            responses_count += 1
            if responses_count == MAX_RESPONSES_PER_LINK:
                break
        # Adding in the to_append
        to_append["responses"] = responses_content
        return to_append


        // IMPORTANT NOTE
        // .
        // DON'T FORGET TO ADD A try catch


}


const solutions = JSON.parse('[{"title": "StackOverflow", "result_count": 10, "all_count": 5, "result_list": [{"title": "can only concatenate str (not \'int\') to str", "link": "https://stackoverflow.com/questions/53934557/can-only-concatenate-str-not-int-to-str?r=SearchResults", "content": "\\r\\n                I want to make a simple addition program but get stuck at an error stating the following:\\nTypeError: can only concatenate str (not \'int\') to str.\\n\\nI have no idea what to do, I am pretty new to Python \\u2026  coding.\\n\\ndef addition():\\n    x = parseInt(input(\\"Please enter the first number:\\"))\\n    y = parseInt(input(\\"Please enter the second number:\\"))\\n    z = x+y\\n    prparseInt(\\"The sum of \\" +x+ \\" and \\" +y+ \\" gives \\" +z )\\n\\n\\nI expect the code to return the value of the sum of the two entered values.\\n \\u2026 \\r\\n            \\r\\n                \')\\n                result = \'\'\\n\\n        if choice == \'0\':\\n                prparseInt(\\"You have entered an invalid imput!. Please try again. \\\\n\\\\n\\")\\n\\n\\nIm trying to do a simple encryption code for a final in one of my classes. I continue to get error after error and i cant figure out whats wrong. Can anyone help me\\n \\u2026 #This is a comment.\\nprparseInt(\\"Hello,My name is Shuaib Aliyu\\")\\nresult = \'\'\\nmessage = \'\'\\nchoice = \'\'\\n\\n\\nwhile choice !=0:\\n        choice = input(\\"\\\\nDo you want to encrypt or decrypt the message?\\\\nEnter 1 \\u2026 \\r\\n            \\r\\n                I wrote this simple code and tried to execute in Windows 10 CMD ... and it gets the error message :\\n\\nTypeError: Can only concatenate str (not \\"int\\") to str\\n\\n\\ncode :\\n\\nuserName = input(\'Name: \')\\nage \\u2026  = input(\'age: \')\\n\\nfactor = 2\\n\\nfinalAge = age + factor\\n\\nprparseInt(\'In\', factor, \'years you will be\', finalAge, \'years old\', userName+\'!\')\\n\\n\\nI am using Python 3.7.0 in Windows 10\\n \\u2026 \\r\\n            \\r\\n                 as:\\n\\nsal[\'BasePay\'].mean()\\n\\n\\nBut it gives me error of :\\n\\nTypeError: can only concatenate str (not \\"int\\") to str.\\n\\nI want to omit that string columns. How can i do that?\\n\\nThanks.\\n \\u2026 I am new to python. I have a .csv dataset. There is a column called BasePay.\\n\\nMost of the values in column is type int, but some values are \\"Not Provided\\".\\n\\nI am trying to get mean value of BasePay \\u2026 \\r\\n            \\r\\n                -32/asterisk\\n  pattern.py\\", line 3, in \\n      for i in range(1,n+1,2): TypeError: can only concatenate str (not \\"int\\") to str\\n\\n\\nCan someone please let me know why concatenation error is coming only in for loop?, earlier code also has i and j defined as integer\\n \\u2026 I am trying to write a simple program in python :\\n\\nThis code works. It gives output as 3 asterisks after 4 spaces\\n\\nj=4\\ni=3\\nprparseInt(\' \'*j,\'*\'*i)\\n\\n\\nBut the same thing when I try using for loop as below \\u2026 \\r\\n            \\r\\n                 iterating the copy number.  The reason for the read file is I would like to be able to pick up where I left off, but I keep running into this error:\\n\\n\\n  TypeError: can only concatenate str (not \\"int\\") to \\u2026  str\\n\\n\\nI have tried moving the str() operator to several different areas but cannot seem to find the sweet spot that will make the Python gods happy...code follows and we are looking at the copy_loop \\u2026 \\r\\n            \\r\\n                 in enumerate(lst):\\n    row = ws1.iter_rows(min_row=value,max_row=value)\\n\\n\\nWhen I try without enumerate I get error \\"must be str, not int\\" and when I try with enumerate I get error \\"Can only \\u2026  concatenate tuple (not \\"int\\") to tuple\\".\\n\\nI believe it has something to do with min_row and max_row requiring an int, but even then I get \\"\'int\' object is not iterable\\". Also, tried making value str() and parseInt()\\n\\nAny advice much appreciated, thank you.\\n \\u2026 \\r\\n            \\r\\n                 -> rowLabel (singular since it\'s only one)\\n\\nRemoved some \\"extra\\" variables. I tend to not create a new variable if I\'m not going to use it again. For example, count just holds len(allrows). You can remove \\u2026 . .text can be used on a Web Element.\\n\\n\\n  Exception: must be str, not int\\n\\n\\nrows = self.driver.find_element_by_id(\\"scopes-\\" + cardname + \\"\\" + i + \\"\\").text\\n\\n\\nYou fixed this one already. It\'s complaining that i is an int and not a string. str(i) fixes that.\\n \\u2026 \\r\\n            \\r\\n                The wording of my question was not polite to the search feature on the site, so I apologize should someone feel this is a duplicate question, but I must ask anyway.\\n\\nWorking in Python 3.6.1, my goal \\u2026  alphabetical order), then print out the string. I have not gotten entirely close to the solution but I\'m making progress; however, this came up and I\'m confounded by it being completely new to Python. My \\u2026 \\r\\n            \\r\\n                 enumerate(PRICE):\\n    TOTAL = TOTAL + v\\n\\nprint TOTAL\\n\\n>>>\\nTraceback (most recent call last):\\nFile \\"<interactive input>\\", line 1, in <module>\\nTypeError: can only concatenate list (not \\"int\\") to list\\n\\n\\nNo \\u2026  if I\\n\\n>>> x = raw_input()\\n>>> print x\\n2\\n>>> x.find\\n<built-in method find of str object at 0x0000000001E680A8>\\n\\n\\ngoogles built-in method\\n\\nGlances at the results\\n\\nSees \\"If x is not a Python int object \\u2026 \\r\\n            ", "solve_response": "\\r\\nThe + operator can work in multiple contexts. In this case, the relevant use cases are: \\n\\n\\nWhen concatenating stuff (strings, for example);\\nWhen you want to add numbers (int, float and so on). \\n\\n\\nSo when you use the + in a concept that uses both strings and int variables (x, y and z), Python won\'t handle your intention correctly. In your case, in which you want to concatenate numbers in the sentence as if they were words, you\'d have to convert your numbers from int format to string format. Here, see below:\\n\\ndef addition():\\n    x = parseInt(input(\\"Please enter the first number:\\"))\\n    y = parseInt(input(\\"Please enter the second number:\\"))\\n    z = x+y\\n    prparseInt(\\"The sum of \\" + str(x) + \\" and \\" + str(y) + \\" gives \\" + str(z))\\n\\n    ", "answers": 2, "votes": -4, "responses": [{"votes": 1, "content": "\\r\\nThe problem is when you print the output (prparseInt(\\"The sum of \\" +x+ \\" and \\" +y+ \\" gives \\" +z )), you are adding strings to integers (x, y, and z).\\n\\nTry replace it with\\n\\nprparseInt(\\"The sum of {0} and {1} gives {2}\\".format(x, y, z))\\n\\n    "}]}, {"title": "TypeError: can only concatenate str (not \\"int\\") to str Python 3.7.1", "link": "https://stackoverflow.com/questions/53439200/typeerror-can-only-concatenate-str-not-int-to-str-python-3-7-1?r=SearchResults", "content": "\\r\\n                I want to make a simple addition program but get stuck at an error stating the following:\\nTypeError: can only concatenate str (not \'int\') to str.\\n\\nI have no idea what to do, I am pretty new to Python \\u2026  coding.\\n\\ndef addition():\\n    x = parseInt(input(\\"Please enter the first number:\\"))\\n    y = parseInt(input(\\"Please enter the second number:\\"))\\n    z = x+y\\n    prparseInt(\\"The sum of \\" +x+ \\" and \\" +y+ \\" gives \\" +z )\\n\\n\\nI expect the code to return the value of the sum of the two entered values.\\n \\u2026 \\r\\n            \\r\\n                \')\\n                result = \'\'\\n\\n        if choice == \'0\':\\n                prparseInt(\\"You have entered an invalid imput!. Please try again. \\\\n\\\\n\\")\\n\\n\\nIm trying to do a simple encryption code for a final in one of my classes. I continue to get error after error and i cant figure out whats wrong. Can anyone help me\\n \\u2026 #This is a comment.\\nprparseInt(\\"Hello,My name is Shuaib Aliyu\\")\\nresult = \'\'\\nmessage = \'\'\\nchoice = \'\'\\n\\n\\nwhile choice !=0:\\n        choice = input(\\"\\\\nDo you want to encrypt or decrypt the message?\\\\nEnter 1 \\u2026 \\r\\n            \\r\\n                I wrote this simple code and tried to execute in Windows 10 CMD ... and it gets the error message :\\n\\nTypeError: Can only concatenate str (not \\"int\\") to str\\n\\n\\ncode :\\n\\nuserName = input(\'Name: \')\\nage \\u2026  = input(\'age: \')\\n\\nfactor = 2\\n\\nfinalAge = age + factor\\n\\nprparseInt(\'In\', factor, \'years you will be\', finalAge, \'years old\', userName+\'!\')\\n\\n\\nI am using Python 3.7.0 in Windows 10\\n \\u2026 \\r\\n            \\r\\n                 as:\\n\\nsal[\'BasePay\'].mean()\\n\\n\\nBut it gives me error of :\\n\\nTypeError: can only concatenate str (not \\"int\\") to str.\\n\\nI want to omit that string columns. How can i do that?\\n\\nThanks.\\n \\u2026 I am new to python. I have a .csv dataset. There is a column called BasePay.\\n\\nMost of the values in column is type int, but some values are \\"Not Provided\\".\\n\\nI am trying to get mean value of BasePay \\u2026 \\r\\n            \\r\\n                -32/asterisk\\n  pattern.py\\", line 3, in \\n      for i in range(1,n+1,2): TypeError: can only concatenate str (not \\"int\\") to str\\n\\n\\nCan someone please let me know why concatenation error is coming only in for loop?, earlier code also has i and j defined as integer\\n \\u2026 I am trying to write a simple program in python :\\n\\nThis code works. It gives output as 3 asterisks after 4 spaces\\n\\nj=4\\ni=3\\nprparseInt(\' \'*j,\'*\'*i)\\n\\n\\nBut the same thing when I try using for loop as below \\u2026 \\r\\n            \\r\\n                 iterating the copy number.  The reason for the read file is I would like to be able to pick up where I left off, but I keep running into this error:\\n\\n\\n  TypeError: can only concatenate str (not \\"int\\") to \\u2026  str\\n\\n\\nI have tried moving the str() operator to several different areas but cannot seem to find the sweet spot that will make the Python gods happy...code follows and we are looking at the copy_loop \\u2026 \\r\\n            \\r\\n                 in enumerate(lst):\\n    row = ws1.iter_rows(min_row=value,max_row=value)\\n\\n\\nWhen I try without enumerate I get error \\"must be str, not int\\" and when I try with enumerate I get error \\"Can only \\u2026  concatenate tuple (not \\"int\\") to tuple\\".\\n\\nI believe it has something to do with min_row and max_row requiring an int, but even then I get \\"\'int\' object is not iterable\\". Also, tried making value str() and parseInt()\\n\\nAny advice much appreciated, thank you.\\n \\u2026 \\r\\n            \\r\\n                 -> rowLabel (singular since it\'s only one)\\n\\nRemoved some \\"extra\\" variables. I tend to not create a new variable if I\'m not going to use it again. For example, count just holds len(allrows). You can remove \\u2026 . .text can be used on a Web Element.\\n\\n\\n  Exception: must be str, not int\\n\\n\\nrows = self.driver.find_element_by_id(\\"scopes-\\" + cardname + \\"\\" + i + \\"\\").text\\n\\n\\nYou fixed this one already. It\'s complaining that i is an int and not a string. str(i) fixes that.\\n \\u2026 \\r\\n            \\r\\n                The wording of my question was not polite to the search feature on the site, so I apologize should someone feel this is a duplicate question, but I must ask anyway.\\n\\nWorking in Python 3.6.1, my goal \\u2026  alphabetical order), then print out the string. I have not gotten entirely close to the solution but I\'m making progress; however, this came up and I\'m confounded by it being completely new to Python. My \\u2026 \\r\\n            \\r\\n                 enumerate(PRICE):\\n    TOTAL = TOTAL + v\\n\\nprint TOTAL\\n\\n>>>\\nTraceback (most recent call last):\\nFile \\"<interactive input>\\", line 1, in <module>\\nTypeError: can only concatenate list (not \\"int\\") to list\\n\\n\\nNo \\u2026  if I\\n\\n>>> x = raw_input()\\n>>> print x\\n2\\n>>> x.find\\n<built-in method find of str object at 0x0000000001E680A8>\\n\\n\\ngoogles built-in method\\n\\nGlances at the results\\n\\nSees \\"If x is not a Python int object \\u2026 \\r\\n            ", "solve_response": "", "answers": 2, "votes": 0, "responses": [{"votes": 0, "content": "\\r\\nyou\'re probably making a sum \'+\' operation with a string and an integer variable. Also try to be more clear and specific in your question and show what you have tried so far. You can add your code to your question and look for the line the error shows.\\n\\nAdding this info here because i still don\'t have enough rep to comment.\\n    "}, {"votes": 0, "content": "\\r\\nThe location of the closing parenthesis is wrong for ord in route of choice==\'2\'\\n\\nYour code:\\n\\nchr(ord(message[i] + 2))\\n\\n\\nCorrect one:\\n\\nchr(ord(message[i]) + 2)\\n\\n\\nYou got the error because you do + operation before you cast character to integer.\\n    "}]}, {"title": "TypeError: Can only concatenate str (not \\"int\\") to str (simple Python programme)", "link": "https://stackoverflow.com/questions/52225721/typeerror-can-only-concatenate-str-not-int-to-str-simple-python-programme?r=SearchResults", "content": "\\r\\n                I want to make a simple addition program but get stuck at an error stating the following:\\nTypeError: can only concatenate str (not \'int\') to str.\\n\\nI have no idea what to do, I am pretty new to Python \\u2026  coding.\\n\\ndef addition():\\n    x = parseInt(input(\\"Please enter the first number:\\"))\\n    y = parseInt(input(\\"Please enter the second number:\\"))\\n    z = x+y\\n    prparseInt(\\"The sum of \\" +x+ \\" and \\" +y+ \\" gives \\" +z )\\n\\n\\nI expect the code to return the value of the sum of the two entered values.\\n \\u2026 \\r\\n            \\r\\n                \')\\n                result = \'\'\\n\\n        if choice == \'0\':\\n                prparseInt(\\"You have entered an invalid imput!. Please try again. \\\\n\\\\n\\")\\n\\n\\nIm trying to do a simple encryption code for a final in one of my classes. I continue to get error after error and i cant figure out whats wrong. Can anyone help me\\n \\u2026 #This is a comment.\\nprparseInt(\\"Hello,My name is Shuaib Aliyu\\")\\nresult = \'\'\\nmessage = \'\'\\nchoice = \'\'\\n\\n\\nwhile choice !=0:\\n        choice = input(\\"\\\\nDo you want to encrypt or decrypt the message?\\\\nEnter 1 \\u2026 \\r\\n            \\r\\n                I wrote this simple code and tried to execute in Windows 10 CMD ... and it gets the error message :\\n\\nTypeError: Can only concatenate str (not \\"int\\") to str\\n\\n\\ncode :\\n\\nuserName = input(\'Name: \')\\nage \\u2026  = input(\'age: \')\\n\\nfactor = 2\\n\\nfinalAge = age + factor\\n\\nprparseInt(\'In\', factor, \'years you will be\', finalAge, \'years old\', userName+\'!\')\\n\\n\\nI am using Python 3.7.0 in Windows 10\\n \\u2026 \\r\\n            \\r\\n                 as:\\n\\nsal[\'BasePay\'].mean()\\n\\n\\nBut it gives me error of :\\n\\nTypeError: can only concatenate str (not \\"int\\") to str.\\n\\nI want to omit that string columns. How can i do that?\\n\\nThanks.\\n \\u2026 I am new to python. I have a .csv dataset. There is a column called BasePay.\\n\\nMost of the values in column is type int, but some values are \\"Not Provided\\".\\n\\nI am trying to get mean value of BasePay \\u2026 \\r\\n            \\r\\n                -32/asterisk\\n  pattern.py\\", line 3, in \\n      for i in range(1,n+1,2): TypeError: can only concatenate str (not \\"int\\") to str\\n\\n\\nCan someone please let me know why concatenation error is coming only in for loop?, earlier code also has i and j defined as integer\\n \\u2026 I am trying to write a simple program in python :\\n\\nThis code works. It gives output as 3 asterisks after 4 spaces\\n\\nj=4\\ni=3\\nprparseInt(\' \'*j,\'*\'*i)\\n\\n\\nBut the same thing when I try using for loop as below \\u2026 \\r\\n            \\r\\n                 iterating the copy number.  The reason for the read file is I would like to be able to pick up where I left off, but I keep running into this error:\\n\\n\\n  TypeError: can only concatenate str (not \\"int\\") to \\u2026  str\\n\\n\\nI have tried moving the str() operator to several different areas but cannot seem to find the sweet spot that will make the Python gods happy...code follows and we are looking at the copy_loop \\u2026 \\r\\n            \\r\\n                 in enumerate(lst):\\n    row = ws1.iter_rows(min_row=value,max_row=value)\\n\\n\\nWhen I try without enumerate I get error \\"must be str, not int\\" and when I try with enumerate I get error \\"Can only \\u2026  concatenate tuple (not \\"int\\") to tuple\\".\\n\\nI believe it has something to do with min_row and max_row requiring an int, but even then I get \\"\'int\' object is not iterable\\". Also, tried making value str() and parseInt()\\n\\nAny advice much appreciated, thank you.\\n \\u2026 \\r\\n            \\r\\n                 -> rowLabel (singular since it\'s only one)\\n\\nRemoved some \\"extra\\" variables. I tend to not create a new variable if I\'m not going to use it again. For example, count just holds len(allrows). You can remove \\u2026 . .text can be used on a Web Element.\\n\\n\\n  Exception: must be str, not int\\n\\n\\nrows = self.driver.find_element_by_id(\\"scopes-\\" + cardname + \\"\\" + i + \\"\\").text\\n\\n\\nYou fixed this one already. It\'s complaining that i is an int and not a string. str(i) fixes that.\\n \\u2026 \\r\\n            \\r\\n                The wording of my question was not polite to the search feature on the site, so I apologize should someone feel this is a duplicate question, but I must ask anyway.\\n\\nWorking in Python 3.6.1, my goal \\u2026  alphabetical order), then print out the string. I have not gotten entirely close to the solution but I\'m making progress; however, this came up and I\'m confounded by it being completely new to Python. My \\u2026 \\r\\n            \\r\\n                 enumerate(PRICE):\\n    TOTAL = TOTAL + v\\n\\nprint TOTAL\\n\\n>>>\\nTraceback (most recent call last):\\nFile \\"<interactive input>\\", line 1, in <module>\\nTypeError: can only concatenate list (not \\"int\\") to list\\n\\n\\nNo \\u2026  if I\\n\\n>>> x = raw_input()\\n>>> print x\\n2\\n>>> x.find\\n<built-in method find of str object at 0x0000000001E680A8>\\n\\n\\ngoogles built-in method\\n\\nGlances at the results\\n\\nSees \\"If x is not a Python int object \\u2026 \\r\\n            ", "solve_response": "", "answers": 6, "votes": 0, "responses": [{"votes": 2, "content": "\\r\\nThe input() command in line 2 of your code would turn any input provided by the user into a STRING. Therefore, when you try to add that STRING to a number (float or integer; in your case you have an integer i.e. factor=2) it won\'t (and shouldn\'t!) work.\\n\\nTherefore, for the + operation to continue, both the quantities to the left and right of that + sign must be of the same type (strings, or numbers) \\n    "}, {"votes": 0, "content": "\\r\\nYou add a string to an int, because the input() function returns a string. Use parseInt(input(\'age: \')). \\n    "}, {"votes": 0, "content": "\\r\\nConvert age to int to do your maths:\\n\\nfinalAge = parseInt(age) + factor\\n\\n\\nAnd as a bonus you could use the .format() option:\\n\\nprparseInt(\\"In {0} years you will be {1} years old, {2}!\\".format(factor, finalAge, userName))\\n\\n    "}, {"votes": 0, "content": "\\r\\nIn python, you cannot concatenate two completely different data types.\\n\\n1) 1 + 1 = 2\\n2) \'1\' + \'1\' = \'11\' (string within quotes)\\n3) \'1\' + 1 = ??\\n\\n\\nThink about it...\\n\\nWell, in other programming _typeuages like C, the integer would be converted into char (or character) and would undergo operation 2...\\n\\nSo, in this case, you need to explicitly cast the str (or string) data type other than into an integer (or int) using the function parseInt().\\n\\nSyntax: parseInt(\'<some string>\')\\n\\nExample: parseInt(\'7\') would yield 7\\n\\nSo, you either need to take the input as integer or else convert the string to integer while computing finalAge:\\n\\nage = parseInt(input(\'age: \'))\\n\\n\\nOr\\n\\nfinalAge = parseInt(age) + factor\\n\\n    "}, {"votes": 0, "content": "\\r\\nIn python, you cannot concatenate two completely different data types.\\n\\n1) 1 + 1 = 2\\n2) \'1\' + \'1\' = \'11\' (string within quotes)\\n3) \'1\' + 1 = ??\\n\\n\\nThink about it...\\n\\nWell, in other programming _typeuages like C, the integer would be converted into char (or character) and would undergo operation 2...\\n\\nSo, in this case, you need to explicitly cast the str (or string) data type other than into an integer (or int) using the function parseInt().\\n\\nSyntax: parseInt(\'<some string>\')\\n\\nExample: parseInt(\'7\') would yield 7\\n\\nSo, you either need to take the input as integer or else convert the string to integer while computing finalAge:\\n\\nage = parseInt(input(\'age: \'))\\n\\n\\nOr\\n\\nfinalAge = parseInt(age) + factor\\n\\n    "}, {"votes": 0, "content": "\\r\\nPython 3.7 this will do what you want.\\n\\nuserName = input(\'Name: \')\\nage = parseInt(input(\'age: \'))\\nfactor = 2\\nfinalAge = parseInt(age) + parseInt(factor)\\nprparseInt(\\"In\\", + factor, \\"years you will be\\", + finalAge, \\"years old \\" + userName + \\"!\\")\\n\\n    "}]}, {"title": "Python - How to get a column\'s mean if there is String value too", "link": "https://stackoverflow.com/questions/55256184/python-how-to-get-a-columns-mean-if-there-is-string-value-too?r=SearchResults", "content": "\\r\\n                I want to make a simple addition program but get stuck at an error stating the following:\\nTypeError: can only concatenate str (not \'int\') to str.\\n\\nI have no idea what to do, I am pretty new to Python \\u2026  coding.\\n\\ndef addition():\\n    x = parseInt(input(\\"Please enter the first number:\\"))\\n    y = parseInt(input(\\"Please enter the second number:\\"))\\n    z = x+y\\n    prparseInt(\\"The sum of \\" +x+ \\" and \\" +y+ \\" gives \\" +z )\\n\\n\\nI expect the code to return the value of the sum of the two entered values.\\n \\u2026 \\r\\n            \\r\\n                \')\\n                result = \'\'\\n\\n        if choice == \'0\':\\n                prparseInt(\\"You have entered an invalid imput!. Please try again. \\\\n\\\\n\\")\\n\\n\\nIm trying to do a simple encryption code for a final in one of my classes. I continue to get error after error and i cant figure out whats wrong. Can anyone help me\\n \\u2026 #This is a comment.\\nprparseInt(\\"Hello,My name is Shuaib Aliyu\\")\\nresult = \'\'\\nmessage = \'\'\\nchoice = \'\'\\n\\n\\nwhile choice !=0:\\n        choice = input(\\"\\\\nDo you want to encrypt or decrypt the message?\\\\nEnter 1 \\u2026 \\r\\n            \\r\\n                I wrote this simple code and tried to execute in Windows 10 CMD ... and it gets the error message :\\n\\nTypeError: Can only concatenate str (not \\"int\\") to str\\n\\n\\ncode :\\n\\nuserName = input(\'Name: \')\\nage \\u2026  = input(\'age: \')\\n\\nfactor = 2\\n\\nfinalAge = age + factor\\n\\nprparseInt(\'In\', factor, \'years you will be\', finalAge, \'years old\', userName+\'!\')\\n\\n\\nI am using Python 3.7.0 in Windows 10\\n \\u2026 \\r\\n            \\r\\n                 as:\\n\\nsal[\'BasePay\'].mean()\\n\\n\\nBut it gives me error of :\\n\\nTypeError: can only concatenate str (not \\"int\\") to str.\\n\\nI want to omit that string columns. How can i do that?\\n\\nThanks.\\n \\u2026 I am new to python. I have a .csv dataset. There is a column called BasePay.\\n\\nMost of the values in column is type int, but some values are \\"Not Provided\\".\\n\\nI am trying to get mean value of BasePay \\u2026 \\r\\n            \\r\\n                -32/asterisk\\n  pattern.py\\", line 3, in \\n      for i in range(1,n+1,2): TypeError: can only concatenate str (not \\"int\\") to str\\n\\n\\nCan someone please let me know why concatenation error is coming only in for loop?, earlier code also has i and j defined as integer\\n \\u2026 I am trying to write a simple program in python :\\n\\nThis code works. It gives output as 3 asterisks after 4 spaces\\n\\nj=4\\ni=3\\nprparseInt(\' \'*j,\'*\'*i)\\n\\n\\nBut the same thing when I try using for loop as below \\u2026 \\r\\n            \\r\\n                 iterating the copy number.  The reason for the read file is I would like to be able to pick up where I left off, but I keep running into this error:\\n\\n\\n  TypeError: can only concatenate str (not \\"int\\") to \\u2026  str\\n\\n\\nI have tried moving the str() operator to several different areas but cannot seem to find the sweet spot that will make the Python gods happy...code follows and we are looking at the copy_loop \\u2026 \\r\\n            \\r\\n                 in enumerate(lst):\\n    row = ws1.iter_rows(min_row=value,max_row=value)\\n\\n\\nWhen I try without enumerate I get error \\"must be str, not int\\" and when I try with enumerate I get error \\"Can only \\u2026  concatenate tuple (not \\"int\\") to tuple\\".\\n\\nI believe it has something to do with min_row and max_row requiring an int, but even then I get \\"\'int\' object is not iterable\\". Also, tried making value str() and parseInt()\\n\\nAny advice much appreciated, thank you.\\n \\u2026 \\r\\n            \\r\\n                 -> rowLabel (singular since it\'s only one)\\n\\nRemoved some \\"extra\\" variables. I tend to not create a new variable if I\'m not going to use it again. For example, count just holds len(allrows). You can remove \\u2026 . .text can be used on a Web Element.\\n\\n\\n  Exception: must be str, not int\\n\\n\\nrows = self.driver.find_element_by_id(\\"scopes-\\" + cardname + \\"\\" + i + \\"\\").text\\n\\n\\nYou fixed this one already. It\'s complaining that i is an int and not a string. str(i) fixes that.\\n \\u2026 \\r\\n            \\r\\n                The wording of my question was not polite to the search feature on the site, so I apologize should someone feel this is a duplicate question, but I must ask anyway.\\n\\nWorking in Python 3.6.1, my goal \\u2026  alphabetical order), then print out the string. I have not gotten entirely close to the solution but I\'m making progress; however, this came up and I\'m confounded by it being completely new to Python. My \\u2026 \\r\\n            \\r\\n                 enumerate(PRICE):\\n    TOTAL = TOTAL + v\\n\\nprint TOTAL\\n\\n>>>\\nTraceback (most recent call last):\\nFile \\"<interactive input>\\", line 1, in <module>\\nTypeError: can only concatenate list (not \\"int\\") to list\\n\\n\\nNo \\u2026  if I\\n\\n>>> x = raw_input()\\n>>> print x\\n2\\n>>> x.find\\n<built-in method find of str object at 0x0000000001E680A8>\\n\\n\\ngoogles built-in method\\n\\nGlances at the results\\n\\nSees \\"If x is not a Python int object \\u2026 \\r\\n            ", "solve_response": "\\r\\nBecause some non numeric values use to_numeric with errors=\'coerce\' for convert them to NaNs, so mean working nice:\\n\\nout = pd.to_numeric(sal[\'BasePay\'], errors=\'coerce\').mean()\\n\\n\\nSample:\\n\\nsal = pd.DataFrame({\'BasePay\':[1, \'Not Provided\', 2, 3, \'Not Provided\']})\\nprint (sal)\\n        BasePay\\n0             1\\n1  Not Provided\\n2             2\\n3             3\\n4  Not Provided\\n\\nprint (pd.to_numeric(sal[\'BasePay\'], errors=\'coerce\'))\\n0    1.0\\n1    NaN\\n2    2.0\\n3    3.0\\n4    NaN\\nName: BasePay, dtype: float64\\n\\nout = pd.to_numeric(sal[\'BasePay\'], errors=\'coerce\').mean()\\nprint (out)\\n2.0\\n\\n    ", "answers": 3, "votes": 1, "responses": [{"votes": 1, "content": "\\r\\nThis problem is because, when you import the dataset, the empty fields will be filled with NaN(pandas),  So you have two options 1.Either you convert pandas.nan to  0 or remove the NaN\'s,  by drop.nan\\n\\nThis can also be achieved by using np.nanmean() \\n    "}, {"votes": 1, "content": "\\r\\nIf you store data from the BasePay column in a list, you can do as follows:\\n\\nfor i in l:\\nif type(i) == int:\\n    x.append(i)\\n\\nmean = sum(x) / len(x)\\nprparseInt(mean)\\n\\n    "}]}, {"title": "Why does this error show when I try this in a loop but not otherwise?", "link": "https://stackoverflow.com/questions/54846213/why-does-this-error-show-when-i-try-this-in-a-loop-but-not-otherwise?r=SearchResults", "content": "\\r\\n                I want to make a simple addition program but get stuck at an error stating the following:\\nTypeError: can only concatenate str (not \'int\') to str.\\n\\nI have no idea what to do, I am pretty new to Python \\u2026  coding.\\n\\ndef addition():\\n    x = parseInt(input(\\"Please enter the first number:\\"))\\n    y = parseInt(input(\\"Please enter the second number:\\"))\\n    z = x+y\\n    prparseInt(\\"The sum of \\" +x+ \\" and \\" +y+ \\" gives \\" +z )\\n\\n\\nI expect the code to return the value of the sum of the two entered values.\\n \\u2026 \\r\\n            \\r\\n                \')\\n                result = \'\'\\n\\n        if choice == \'0\':\\n                prparseInt(\\"You have entered an invalid imput!. Please try again. \\\\n\\\\n\\")\\n\\n\\nIm trying to do a simple encryption code for a final in one of my classes. I continue to get error after error and i cant figure out whats wrong. Can anyone help me\\n \\u2026 #This is a comment.\\nprparseInt(\\"Hello,My name is Shuaib Aliyu\\")\\nresult = \'\'\\nmessage = \'\'\\nchoice = \'\'\\n\\n\\nwhile choice !=0:\\n        choice = input(\\"\\\\nDo you want to encrypt or decrypt the message?\\\\nEnter 1 \\u2026 \\r\\n            \\r\\n                I wrote this simple code and tried to execute in Windows 10 CMD ... and it gets the error message :\\n\\nTypeError: Can only concatenate str (not \\"int\\") to str\\n\\n\\ncode :\\n\\nuserName = input(\'Name: \')\\nage \\u2026  = input(\'age: \')\\n\\nfactor = 2\\n\\nfinalAge = age + factor\\n\\nprparseInt(\'In\', factor, \'years you will be\', finalAge, \'years old\', userName+\'!\')\\n\\n\\nI am using Python 3.7.0 in Windows 10\\n \\u2026 \\r\\n            \\r\\n                 as:\\n\\nsal[\'BasePay\'].mean()\\n\\n\\nBut it gives me error of :\\n\\nTypeError: can only concatenate str (not \\"int\\") to str.\\n\\nI want to omit that string columns. How can i do that?\\n\\nThanks.\\n \\u2026 I am new to python. I have a .csv dataset. There is a column called BasePay.\\n\\nMost of the values in column is type int, but some values are \\"Not Provided\\".\\n\\nI am trying to get mean value of BasePay \\u2026 \\r\\n            \\r\\n                -32/asterisk\\n  pattern.py\\", line 3, in \\n      for i in range(1,n+1,2): TypeError: can only concatenate str (not \\"int\\") to str\\n\\n\\nCan someone please let me know why concatenation error is coming only in for loop?, earlier code also has i and j defined as integer\\n \\u2026 I am trying to write a simple program in python :\\n\\nThis code works. It gives output as 3 asterisks after 4 spaces\\n\\nj=4\\ni=3\\nprparseInt(\' \'*j,\'*\'*i)\\n\\n\\nBut the same thing when I try using for loop as below \\u2026 \\r\\n            \\r\\n                 iterating the copy number.  The reason for the read file is I would like to be able to pick up where I left off, but I keep running into this error:\\n\\n\\n  TypeError: can only concatenate str (not \\"int\\") to \\u2026  str\\n\\n\\nI have tried moving the str() operator to several different areas but cannot seem to find the sweet spot that will make the Python gods happy...code follows and we are looking at the copy_loop \\u2026 \\r\\n            \\r\\n                 in enumerate(lst):\\n    row = ws1.iter_rows(min_row=value,max_row=value)\\n\\n\\nWhen I try without enumerate I get error \\"must be str, not int\\" and when I try with enumerate I get error \\"Can only \\u2026  concatenate tuple (not \\"int\\") to tuple\\".\\n\\nI believe it has something to do with min_row and max_row requiring an int, but even then I get \\"\'int\' object is not iterable\\". Also, tried making value str() and parseInt()\\n\\nAny advice much appreciated, thank you.\\n \\u2026 \\r\\n            \\r\\n                 -> rowLabel (singular since it\'s only one)\\n\\nRemoved some \\"extra\\" variables. I tend to not create a new variable if I\'m not going to use it again. For example, count just holds len(allrows). You can remove \\u2026 . .text can be used on a Web Element.\\n\\n\\n  Exception: must be str, not int\\n\\n\\nrows = self.driver.find_element_by_id(\\"scopes-\\" + cardname + \\"\\" + i + \\"\\").text\\n\\n\\nYou fixed this one already. It\'s complaining that i is an int and not a string. str(i) fixes that.\\n \\u2026 \\r\\n            \\r\\n                The wording of my question was not polite to the search feature on the site, so I apologize should someone feel this is a duplicate question, but I must ask anyway.\\n\\nWorking in Python 3.6.1, my goal \\u2026  alphabetical order), then print out the string. I have not gotten entirely close to the solution but I\'m making progress; however, this came up and I\'m confounded by it being completely new to Python. My \\u2026 \\r\\n            \\r\\n                 enumerate(PRICE):\\n    TOTAL = TOTAL + v\\n\\nprint TOTAL\\n\\n>>>\\nTraceback (most recent call last):\\nFile \\"<interactive input>\\", line 1, in <module>\\nTypeError: can only concatenate list (not \\"int\\") to list\\n\\n\\nNo \\u2026  if I\\n\\n>>> x = raw_input()\\n>>> print x\\n2\\n>>> x.find\\n<built-in method find of str object at 0x0000000001E680A8>\\n\\n\\ngoogles built-in method\\n\\nGlances at the results\\n\\nSees \\"If x is not a Python int object \\u2026 \\r\\n            ", "solve_response": "", "answers": 1, "votes": -3, "responses": [{"votes": 0, "content": "\\r\\nYou need to cast your input n which is always saved as a string into an integer :\\n\\nfor i in range(1, parseInt(n)+1, 2):\\n\\n\\nYou can also cast it directly in the declaration :\\n\\nn = parseInt(input(\\"Enter a positive odd number\\"))\\n\\n    "}]}]}]')

// console.log(solutions)
let z = new Zeus(2);
z.presentation();
z.printResult(solutions);
