/*
 * ffi-export.h
 *
 *  Created on: Oct 26,2018
 *  Updated on: Jan 15,2019
 *      Author: Jaehong Park (binizcode) / jaehong1972@gmail.com
 */
#ifndef FFI_H_
#define FFI_H_

#include "mgos.h"
#include "mgos_rpc.h"
#include "Arduino.h"
#include "WString.h"
#include "Print.h"
#include "mongoose.h"

#if defined(__cplusplus)
extern "C" {
#endif
/*  
    double tan_ffi(double var);
    double atan_ffi(double var);
    double atan2_ffi(double var1, double var2);
*/  
    char* split2str(char* src, char* delimiter, int num);
    //char* dest = replace("abc is efg", "abc", "efg"); -> dest: "efg is efg"
    char *replace(char *s, char *olds, char *news);

#if defined(__cplusplus)
}
#endif

#endif//#ifndef FFI_H_