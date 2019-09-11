import json

from lxml import html, etree
import requests
from sys import exit

LIST_JSON_PATH = "../list.json"
MAX_RESULT = 5
MAX_RESPONSES_PER_LINK = 6

class Zeus:

    def __init__(self, lang = "Python", specific_link=[], search_level = 0):
        """
        Keyword Arguments:
            specific_link {list} -- [list of specific link, where to find] (default: {[]})
            search_level {int} -- [The level of searching results going from 0 to 5] (default: {0})
        """
        self.lang = lang
        self.specific_link = specific_link
        self.search_level = search_level


    def printResult(self, solutions):
        """
        A function that return the result of solutions around the web

        Keyword Arguments:
            solutions {list} -- [The list of solutions fetched] (default: {""})
        """
        choice = 0
        while(choice == 0):
            print("\n\n[+] -----------------")
            count_sol = 1
            for sol in solutions:
                print("[+] "+str(count_sol)+"-) "+sol["title"]+" ("+str(sol["all_count"])+" / "+str(sol["result_count"])+")")
                count_sol += 1
            print("[+] 0-) To stop/Back")
            print("[+] -----------------")

            choice = int(input("[+] Choose available options: "))

        try:
            choice2 = 0
            while(choice2 == 0):
                selected = solutions[choice-1]
                print("\n\n[+] -----------------")
                print("[+] On "+selected["title"]+"\n")
                count_selected = 1
                for select in selected["result_list"]:
                    print("[+] "+str(count_selected)+"-) "+select["title"]+" ("+str(select["answers"])+" answers, "+str(select["votes"])+" votes)")
                    count_selected += 1
                print("[+] 0-) To Back")
                print("[+] -----------------")

                choice2 = int(input("[+] Choose available options: "))

                try:
                    print("\n\n[+] -----------------")
                    print("[+] On "+selected["title"])
                    print("[+] > Title : '"+selected["result_list"][choice2-1]["title"]+"'")
                    print("[+] > Link : '"+selected["result_list"][choice2-1]["link"]+"'")

                    if len(selected["result_list"][choice2-1]["solve_response"]) > 4:
                        print("[+] > Solution : ")
                        print("[+] ===================================================================================================")
                        print("[+] ---------------------------------------------------------------------------------------------------")
                        print(selected["result_list"][choice2-1]["solve_response"].replace("\n", "\n[+] "))
                        print("[+] ---------------------------------------------------------------------------------------------------")
                        print("[+] ===================================================================================================")

                    getall = str(input("[+] Do you want to get all responses ? (Y/N) :")).lower()
                    try:
                        if getall == "y":
                            print("[+] > Others responses :")
                            print("\n[+] -")
                            respp_count = 1
                            for respp in selected["result_list"][choice2-1]["responses"]:
                                print("[+] ```````````````````````````````````````````````````````````````````````````````````````")
                                print("[+] "+str(respp_count)+"-) "+str(respp["votes"])+"Votes")
                                print("[+] ```````````````````````````````````````````````````````````````````````````````````````")
                                print("[+] "+respp["content"].replace("\n", "\n[+] \t"))
                                respp_count += 1
                            print("[+] -\n")
                    except Exception as es:
                        pass
                    print("[+] 0-) To Back")
                    print("[+] 99-) To Exit")
                    print("[+] -----------------")
                    choice2 = int(input("[+] Choose available options: "))
                    if choice2 == 99:
                        exit()
                except Exception as es:
                    print(es)

        except Exception as es:
            print(es)


    def go(self, error):
        """
        A function that return the result of solutions around the web

        Keyword Arguments:
            error {str} -- [The error message] (default: {""})
        """
        print("[+] ---------------------------------------------------------------------")
        print("[+] |__  /___ _   _ ___  ")
        print("[+]   / // _ \ | | / __|")
        print("[+]  / /|  __/ |_| \__ \\")
        print("[+] /____\___|\__,_|___/ by S@n1x-d4rk3r (github.com/sanix-darker)")
        print("[+] ---------------------------------------------------------------------")
        checking_message = "\r[+] Checking available solution(s) online, level : "+str(self.search_level)+"."
        print(checking_message, end="")
        error = self.lang+" "+str(error)
        with open(LIST_JSON_PATH, "r") as file_:
            JSONArray = json.loads(file_.read())
            solutions = []
            for JSONObj in JSONArray:
                checking_message += "."
                print(checking_message, end="")
                search_link = JSONObj['search_link'].replace("[z]", error.replace(" ", JSONObj['space_replacement']))
                r = requests.get(search_link)
                if r.status_code == 200:
                    checking_message += "."
                    print(checking_message, end="")
                    tree = html.fromstring(r.content)
                    titles = tree.xpath(JSONObj['each']['title'])
                    result_list = []
                    i = 0
                    for elt in titles:
                        checking_message += "."
                        print(checking_message, end="")
                        link = tree.xpath(JSONObj['each']['link'])[i]
                        if("://" not in link) :
                            link = JSONObj['link'] + link
                        source = requests.get(link)
                        # The tree2 for sub-requests
                        tree2 = html.fromstring(source.content)

                        to_append =  {
                            "title": elt,
                            "link": link
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

                        result_list.append(to_append)
                        i += 1
                        if i == MAX_RESULT:
                            break

                    checking_message += "."
                    print(checking_message, end="")

                    result_count = len(titles)
                    all_count = i
                    solutions.append( {
                        "title": JSONObj['title'],
                        "result_count": result_count,
                        "all_count": all_count,
                        "result_list": result_list
                    })
            self.printResult( solutions )