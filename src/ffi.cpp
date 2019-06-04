/*
 * ffi-export.cpp
 *
 *  Created on: Oct 26,2018
 *  Updated on: Jan 15,2019
 *      Author: Jaehong Park (binizcode) / jaehong1972@gmail.com
 */
#include "ffi.h"
#include "string.h"
#include "stdlib.h"
#include "math.h"
#include "frozen.h"

//let replace = ffi('char *replace(char *s, const char *olds, const char *news)');
//let split = ffi('char* split2str(char* src, char* delimiter, int num)');
//let str2float = ffi('double parseFloat(char* str)');
//let str2int = ffi('int parseInt(char* str)');
//let tan = ffi('double tan_ffi(double var)');
//let atan = ffi('double atan_ffi(double var)');
//let atan2 = ffi('double atan2_ffi(double var1, double var2)');

#if defined(__cplusplus)
extern "C" {
#endif
/*
    double tan_ffi(double var)
    {
        return tan(var);
    }

    double atan_ffi(double var)
    {
        return atan(var);
    }

    double atan2_ffi(double var1, double var2)
    {
        return atan2(var1, var2);
    }
*/
    //split("32.145, 127.234", ",", 0); => "32.145"
    //split("32.145, 127.234", ",", 1); => "127.234"
    char* split2str(char* src, char* delimiter, int num)
    {
      if(num >= 2) {
            printf("argv[3] shoud be less than 2.\n\r");
            return NULL;
      }

      {        
        int i = 0;
        char *ptr = strtok(src, delimiter);        
        if(ptr == NULL) return NULL;

        while (ptr != NULL){
            if (num == i) break;
            ptr = strtok(NULL, delimiter);
            i++;
        }

        printf("split2str() %dth string: %s\n\r", (num + 1), ptr);
        return ptr;
      }
    }
/*
    char* split2str(char* src, char* delimiter, int num)
    {
        char s1[30] = "The Little Prince";
        char *ptr = strtok(s1, " ");
        while (ptr != NULL)
        {
            printf("%s\n", ptr);
            ptr = strtok(NULL, " ");
        }
        return 0;
    }
*/
    char *replace(char *s, char *olds, char *news) 
    {
        char *result, *sr;
        size_t i, count = 0;
        size_t oldlen = strlen(olds); 
        if (oldlen < 1) {
            printf("Error: oldlen, 0\n\r");
            return s;
        }
        size_t newlen = strlen(news);

        if (newlen != oldlen) {
            for (i = 0; s[i] != '\0';) {
                if (memcmp(&s[i], olds, oldlen) == 0) count++, i += oldlen;
                else i++;
            }
        } else i = strlen(s);

        result = (char *) malloc(i + 1 + count * (newlen - oldlen));
        if (result == NULL) {
            printf("Error: malloc, null\n\r");
            return NULL;
        }

        sr = result;
        while (*s) {
            if (memcmp(s, olds, oldlen) == 0) {
            memcpy(sr, news, newlen);
            sr += newlen;
            s  += oldlen;
            } else *sr++ = *s++;
        }
        *sr = '\0';

        printf("replace(): %s\n\r", result);
        return result;
    }

#if defined(__cplusplus)
}
#endif
