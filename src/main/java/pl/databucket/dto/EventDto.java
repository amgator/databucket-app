package pl.databucket.dto;

import lombok.Getter;
import lombok.Setter;
import pl.databucket.configuration.Constants;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Map;

@Getter
@Setter
public class EventDto {

    private Long id;
    @Size(min = Constants.NAME_MIN, max = Constants.NAME_MAX)
    private String name;
    @Size(max = Constants.DESCRIPTION_MAX)
    private String description;
    private boolean active;
    private Long bucketId;
    private Long classId;
    private Map<String, Object> schedule;
    private Map<String, Object> tasks;

    private String createdBy;
    private Date createdAt;
    private String modifiedBy;
    private Date modifiedAt;

}
