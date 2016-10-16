// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

#ifndef __BME280_H
#define __BME280_H


#ifdef __cplusplus
extern "C" {
#endif

///////////////////////////////////////////////////////////////////////////////////////////////////
void initBme(void);

///////////////////////////////////////////////////////////////////////////////////////////////////
void getNextSample(float* Temperature, float* Humidity);

#ifdef __cplusplus
}
#endif


#endif//__BME280_H

