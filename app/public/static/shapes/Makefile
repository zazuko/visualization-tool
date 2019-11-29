SHELL := /bin/bash
Q = @

#
# Geodata
# https://www.bfs.admin.ch/bfs/de/home/dienstleistungen/geostat/geodaten-bundesstatistik/administrative-grenzen/generalisierte-gemeindegrenzen.html
#
# // 2018+
# unzip -p $$< $$(patsubst geodata/%,ggg_20$$*-LV95/shp/%,$$@) > $$@
# // 2017
# unzip -p $$< $$(patsubst geodata/%,ggg_20$$*/shp/LV95/%,$$@) > $$@
# // 2016 // CH_ISO
# unzip -p $$< $$(patsubst geodata/%,ggg_20$$*/shp/%,$$@) > $$@
# // 2015 (nested zip)
# unzip -p $$< $$(patsubst geodata/%,shp/%,$$@) > $$@
# // 2014, 2013
# unzip -p $$< $$(patsubst geodata/%,ggg_20$$*/shp/%,$$@) > $$@
# // 2012, 2011, 2010 (all files uppercase, NAME,GMDE,KT)
# unzip -p $$< $$(patsubst geodata/%,g1g$$*_shp_121130/%,$$@) > $$@
# // 2009 (all files uppercase, NAME,GMDE,KT)
# unzip -p $$< $$(patsubst geodata/%,g1g$$*_shp_090626/%,$$@) > $$@

.PHONY: geodata

geodata: \
	topojson/2019/ch-country.json \
	topojson/2019/ch-cantons.json \
	topojson/2019/ch-lakes.json \
	topojson/2019/ch-municipalities.json \
	topojson/2018/ch-country.json \
	topojson/2018/ch-cantons.json \
	topojson/2018/ch-lakes.json \
	topojson/2018/ch-municipalities.json \
	topojson/2017/ch-country.json \
	topojson/2017/ch-cantons.json \
	topojson/2017/ch-lakes.json \
	topojson/2017/ch-municipalities.json \
	topojson/2016/ch-country.json \
	topojson/2016/ch-cantons.json \
	topojson/2016/ch-lakes.json \
	topojson/2016/ch-municipalities.json \
	topojson/2015/ch-country.json \
	topojson/2015/ch-cantons.json \
	topojson/2015/ch-lakes.json \
	topojson/2015/ch-municipalities.json \
	topojson/2014/ch-country.json \
	topojson/2014/ch-cantons.json \
	topojson/2014/ch-lakes.json \
	topojson/2014/ch-municipalities.json \
	topojson/2013/ch-country.json \
	topojson/2013/ch-cantons.json \
	topojson/2013/ch-lakes.json \
	topojson/2013/ch-municipalities.json \
	topojson/2012/ch-country.json \
	topojson/2012/ch-cantons.json \
	topojson/2012/ch-lakes.json \
	topojson/2012/ch-municipalities.json \
	topojson/2011/ch-country.json \
	topojson/2011/ch-cantons.json \
	topojson/2011/ch-lakes.json \
	topojson/2011/ch-municipalities.json \
	topojson/2010/ch-country.json \
	topojson/2010/ch-cantons.json \
	topojson/2010/ch-lakes.json \
	topojson/2010/ch-municipalities.json \
	topojson/2009/ch-country.json \
	topojson/2009/ch-cantons.json \
	topojson/2009/ch-lakes.json \
	topojson/2009/ch-municipalities.json \
# ---

topojson/20%/ch-country.json: geodata/G1L%.shp geodata/G1L%.dbf geodata/G1L%.prj
# topojson/20%/ch-country.json: geodata/g1l%.shp geodata/g1l%.dbf geodata/g1l%.prj
	mkdir -p $(dir $@)
	yarn run mapshaper $< \
	  -proj wgs84 \
	  -filter-fields NAME \
	  -rename-layers country \
	  -o format=topojson id-field=NAME $@

topojson/20%/ch-cantons.json: geodata/G1K%.shp geodata/G1K%.dbf geodata/G1K%.prj
# topojson/20%/ch-cantons.json: geodata/g1k%.shp geodata/g1k%.dbf geodata/g1k%.prj
	mkdir -p $(dir $@)
	yarn run mapshaper $< \
	  -proj wgs84 \
	  -filter-fields KT \
	  -rename-layers cantons \
	  -o format=topojson id-field=KT $@

topojson/20%/ch-lakes.json: geodata/G1S%.shp geodata/G1S%.dbf geodata/G1S%.prj
# topojson/20%/ch-lakes.json: geodata/g1s%.shp geodata/g1s%.dbf geodata/g1s%.prj
	mkdir -p $(dir $@)
	yarn run mapshaper $< \
	  -proj wgs84 \
	  -filter-fields \
	  -rename-layers lakes \
	  -o format=topojson $@

topojson/20%/ch-municipalities.json: geodata/G1G%.shp geodata/G1G%.dbf geodata/G1G%.prj
# topojson/20%/ch-municipalities.json: geodata/g1g%.shp geodata/g1g%.dbf geodata/g1g%.prj
	mkdir -p $(dir $@)
	yarn run mapshaper $< \
	  -proj wgs84 \
	  -filter-fields GMDE,KT \
	  -rename-fields parentId=KT \
	  -rename-layers municipalities \
	  -o format=topojson id-field=GMDE $@

# Generate targets based on
#   - types (g=Gemeinde, l=Landesgrenze, s=See), and
#   - extensions (shp, dbf, prj)
#
# Examples: geodata/g1g19.shp, geodata/g1k18.dbf, etc.
define extract_from_archive
# geodata/g1$(1)%.$(2): geodata/20%.zip
geodata/G1$(1)%.$(2): geodata/20%.zip
	# unzip -p $$< $$(patsubst geodata/%,ggg_20$$*-LV95/shp/%,$$@) > $$@
	# unzip -p $$< $$(patsubst geodata/%,ggg_20$$*/shp/LV95/%,$$@) > $$@
	# unzip -p $$< $$(patsubst geodata/%,ggg_20$$*/shp/%,$$@) > $$@
	# unzip -p $$< $$(patsubst geodata/%,shp/%,$$@) > $$@
	# unzip -p $$< $$(patsubst geodata/%,ggg_20$$*/shp/%,$$@) > $$@
	# unzip -p $$< $$(patsubst geodata/%,g1g$$*_shp_121130/%,$$@) > $$@
	unzip -p $$< $$(patsubst geodata/%,g1g$$*_shp_090626/%,$$@) > $$@

endef
# $(foreach type,g k l s,$(foreach ext,shp dbf prj,$(eval $(call extract_from_archive,$(type),$(ext)))))
$(foreach type,G K L S,$(foreach ext,shp dbf prj,$(eval $(call extract_from_archive,$(type),$(ext)))))

geodata/2019.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/7566557/master"

geodata/2018.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/5247306/master"
	
geodata/2017.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/4342877/master"

geodata/2016.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/1902553/master"

geodata/2015.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/330759/master"

geodata/2014.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/328824/master"

geodata/2013.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/282011/master"

geodata/2012.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/301391/master"

geodata/2011.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/301387/master"

geodata/2010.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/301383/master" 

geodata/2009.zip:
	curl -o $@ "https://www.bfs.admin.ch/bfsstatic/dam/assets/860930/master" 